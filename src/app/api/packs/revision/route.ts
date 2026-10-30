import { NextResponse } from "next/server";
import { computePackHash } from "@/lib/hash";
import { runFullPreflightInspection } from "@/lib/preflight";
import { memoryStore } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      campaignId,
      caption,
      bannerBase64,
      bannerName,
      pdfText,
      pdfName,
      designerNote,
      actorName,
    } = body;

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: "campaignId is required" },
        { status: 400 }
      );
    }

    const campaign = memoryStore.getCampaign(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    const activeContract =
      campaign.contracts.find((c: any) => c.isActive) || campaign.contracts[0];

    if (!activeContract) {
      return NextResponse.json(
        { success: false, error: "Active contract not found" },
        { status: 404 }
      );
    }

    const contractSpec = {
      product: campaign.product,
      market: activeContract.market,
      channel: activeContract.channel,
      audience: activeContract.audience,
      offerPercent: activeContract.offerPercent,
      eligibility: activeContract.eligibility,
      endDate: activeContract.endDate,
      approvedClaims:
        typeof activeContract.approvedClaimsJson === "string"
          ? JSON.parse(activeContract.approvedClaimsJson || "[]")
          : activeContract.approvedClaims || [],
      requiredQuals:
        typeof activeContract.requiredQualsJson === "string"
          ? JSON.parse(activeContract.requiredQualsJson || "[]")
          : activeContract.requiredQuals || [],
      prohibitedTerms:
        typeof activeContract.prohibitedTermsJson === "string"
          ? JSON.parse(activeContract.prohibitedTermsJson || "[]")
          : activeContract.prohibitedTerms || [],
      variants:
        typeof activeContract.variantsJson === "string"
          ? JSON.parse(activeContract.variantsJson || "[]")
          : activeContract.variants || [],
    };

    // Run Preflight Inspection on revised assets
    const newFindings = await runFullPreflightInspection({
      contract: contractSpec,
      caption: caption || "",
      bannerBase64: bannerBase64 || null,
      bannerName: bannerName || null,
      pdfText: pdfText || null,
    });

    const newPack = memoryStore.submitRevision(
      campaignId,
      {
        caption,
        bannerBase64,
        bannerName,
        pdfText,
        pdfName,
        designerNote,
      },
      newFindings,
      actorName || "Alex Chen"
    );

    const changeOrders = memoryStore.getCampaign(campaignId)?.changeOrders || [];

    const changeOrder = changeOrders[0] || null;

    return NextResponse.json({
      success: true,
      data: {
        pack: newPack,
        newPack,
        changeOrders,
        changeOrder,
        findingsCount: newFindings.length,
      },
      message: `Revision uploaded. ${newFindings.length} remaining findings detected.`,
    });
  } catch (error) {
    console.error("Failed to submit pack revision:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process revision submission" },
      { status: 500 }
    );
  }
}
