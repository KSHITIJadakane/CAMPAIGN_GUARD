import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computePackHash } from "@/lib/hash";
import { runFullPreflightInspection } from "@/lib/preflight";
import { memoryStore } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campaignId, caption, bannerBase64, bannerName, pdfText, pdfName, actorName } = body;

    if (!campaignId) {
      return NextResponse.json({ success: false, error: "campaignId is required" }, { status: 400 });
    }

    // Try finding campaign in Prisma or MemoryStore
    let campaign: any = null;
    let activeContract: any = null;

    try {
      campaign = await prisma.campaign.findUnique({
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
      activeContract = campaign?.contracts?.[0];
    } catch (e) {
      console.warn("Prisma fetch failed, using memoryStore:", e);
    }

    if (!campaign) {
      campaign = memoryStore.getCampaign(campaignId);
      activeContract = campaign?.contracts?.find((c: any) => c.isActive) || campaign?.contracts?.[0];
    }

    if (!campaign || !activeContract) {
      return NextResponse.json({ success: false, error: "Campaign or Contract not found" }, { status: 404 });
    }

    const lastPack = campaign.packs?.[0];
    const newRevision = (lastPack?.revision || 0) + 1;
    const packHash = computePackHash(caption, bannerBase64, pdfText);

    const contractSpec = {
      product: campaign.product,
      market: activeContract.market,
      channel: activeContract.channel,
      audience: activeContract.audience,
      offerPercent: activeContract.offerPercent,
      eligibility: activeContract.eligibility,
      endDate: activeContract.endDate,
      approvedClaims: typeof activeContract.approvedClaimsJson === "string" ? JSON.parse(activeContract.approvedClaimsJson || "[]") : (activeContract.approvedClaims || []),
      requiredQuals: typeof activeContract.requiredQualsJson === "string" ? JSON.parse(activeContract.requiredQualsJson || "[]") : (activeContract.requiredQuals || []),
      prohibitedTerms: typeof activeContract.prohibitedTermsJson === "string" ? JSON.parse(activeContract.prohibitedTermsJson || "[]") : (activeContract.prohibitedTerms || []),
      variants: typeof activeContract.variantsJson === "string" ? JSON.parse(activeContract.variantsJson || "[]") : (activeContract.variants || []),
    };

    // Run Preflight Engine
    const findings = await runFullPreflightInspection({
      contract: contractSpec,
      caption: caption || "",
      bannerBase64: bannerBase64 || null,
      bannerName: bannerName || null,
      pdfText: pdfText || null,
    });

    try {
      const wasApproved = campaign.status === "APPROVED";
      const newStatus = wasApproved ? "INVALIDATED" : "NEEDS_REVIEW";

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
        include: { findings: true },
      });

      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: newStatus },
      });

      await prisma.auditLog.create({
        data: {
          campaignId,
          actorName: actorName || "Alex Chen",
          actorRole: "CREATOR",
          action: "PACK_SUBMITTED",
          detail: `Submitted Campaign Pack Rev ${newRevision} (Hash: ${packHash}). Preflight inspection detected ${findings.length} findings across layers.`,
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
    } catch (dbErr) {
      console.warn("Prisma pack save failed, using memoryStore:", dbErr);
    }

    const savedPack = memoryStore.submitPack(
      campaignId,
      { caption, bannerBase64, bannerName, pdfText, pdfName },
      findings,
      actorName
    );

    return NextResponse.json({
      success: true,
      pack: savedPack,
      findings,
      revision: newRevision,
      packHash,
      campaignStatus: "NEEDS_REVIEW",
    });
  } catch (error) {
    console.error("POST /api/packs/check error:", error);
    return NextResponse.json({ success: false, error: "Inspection failed" }, { status: 500 });
  }
}