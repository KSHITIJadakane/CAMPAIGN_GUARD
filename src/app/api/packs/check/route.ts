import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computePackHash } from "@/lib/hash";
import { runFullPreflightInspection } from "@/lib/preflight";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campaignId, caption, bannerBase64, bannerName, pdfText, pdfName, actorName } = body;

    if (!campaignId) {
      return NextResponse.json({ success: false, error: "campaignId is required" }, { status: 400 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        contracts: {
          where: { isActive: true },
          take: 1,
        },
        packs: {
          orderBy: { revision: "desc" },
          take: 1,
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }

    const activeContract = campaign.contracts[0];
    if (!activeContract) {
      return NextResponse.json({ success: false, error: "No active Campaign Contract found" }, { status: 400 });
    }

    // Determine revision number
    const lastPack = campaign.packs[0];
    const newRevision = (lastPack?.revision || 0) + 1;

    // Compute cryptographic SHA256 revision hash
    const packHash = computePackHash(caption, bannerBase64, pdfText);

    // Prepare contract specification for check engine
    const contractSpec = {
      product: campaign.product,
      market: activeContract.market,
      channel: activeContract.channel,
      audience: activeContract.audience,
      offerPercent: activeContract.offerPercent,
      eligibility: activeContract.eligibility,
      endDate: activeContract.endDate,
      approvedClaims: JSON.parse(activeContract.approvedClaimsJson || "[]"),
      requiredQuals: JSON.parse(activeContract.requiredQualsJson || "[]"),
      prohibitedTerms: JSON.parse(activeContract.prohibitedTermsJson || "[]"),
      variants: JSON.parse(activeContract.variantsJson || "[]"),
    };

    // Run Preflight Inspection Engine (Deterministic + Gemini Multimodal)
    const findings = await runFullPreflightInspection({
      contract: contractSpec,
      caption: caption || "",
      bannerBase64: bannerBase64 || null,
      bannerName: bannerName || null,
      pdfText: pdfText || null,
    });

    // Check if previous approval was invalidated by this new revision
    const wasApproved = campaign.status === "APPROVED";
    const newStatus = wasApproved ? "INVALIDATED" : "NEEDS_REVIEW";

    // Create CampaignPack record with findings
    const newPack = await prisma.campaignPack.create({
      data: {
        campaignId,
        revision: newRevision,
        packHash,
        caption: caption || "",
        bannerBase64: bannerBase64 || null,
        bannerName: bannerName || null,
        pdfText: pdfText || null,
        pdfName: pdfName || null,
        status: findings.length > 0 ? "FINDINGS" : "READY_FOR_APPROVAL",
        findings: {
          create: findings.map((f) => ({
            layer: f.layer,
            location: f.location,
            issue: f.issue,
            evidence: f.evidence,
            suggestedFix: f.suggestedFix,
            status: f.status,
            resolution: "PENDING",
          })),
        },
      },
      include: {
        findings: true,
      },
    });

    // Update campaign status
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: newStatus },
    });

    // Log audit trail
    await prisma.auditLog.create({
      data: {
        campaignId,
        actorName: actorName || "Alex Chen",
        actorRole: "CREATOR",
        action: "PACK_SUBMITTED",
        detail: `Submitted Campaign Pack Rev ${newRevision} (Hash: ${packHash}). Preflight inspection detected ${findings.length} findings across layers. ${
          wasApproved ? "Prior approval invalidated due to revised assets." : ""
        }`,
      },
    });

    return NextResponse.json({
      success: true,
      pack: newPack,
      findings,
      revision: newRevision,
      packHash,
      campaignStatus: newStatus,
    });
  } catch (error) {
    console.error("POST /api/packs/check error:", error);
    return NextResponse.json({ success: false, error: "Inspection failed" }, { status: 500 });
  }
}