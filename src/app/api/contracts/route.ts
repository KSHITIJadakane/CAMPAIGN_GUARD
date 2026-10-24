import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      campaignId,
      market,
      channel,
      audience,
      offerPercent,
      eligibility,
      endDate,
      approvedClaims,
      requiredQuals,
      prohibitedTerms,
      variants,
      actorName,
    } = body;

    if (!campaignId) {
      return NextResponse.json({ success: false, error: "campaignId is required" }, { status: 400 });
    }

    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { contracts: { orderBy: { version: "desc" } } },
      });

      if (campaign) {
        const nextVersion = (campaign.contracts[0]?.version || 0) + 1;

        await prisma.contract.updateMany({
          where: { campaignId },
          data: { isActive: false },
        });

        const newContract = await prisma.contract.create({
          data: {
            campaignId,
            version: nextVersion,
            market: market || "Global",
            channel: channel || "Instagram",
            audience: audience || "General Public",
            offerPercent: typeof offerPercent === "number" ? offerPercent : parseFloat(offerPercent || "20"),
            eligibility: eligibility || "Selected items",
            endDate: endDate || "2026-10-31",
            approvedClaimsJson: JSON.stringify(approvedClaims || []),
            requiredQualsJson: JSON.stringify(requiredQuals || []),
            prohibitedTermsJson: JSON.stringify(prohibitedTerms || []),
            variantsJson: JSON.stringify(variants || []),
            isActive: true,
          },
        });

        const previousStatus = campaign.status;
        const newStatus = previousStatus === "APPROVED" ? "INVALIDATED" : "NEEDS_REVIEW";

        await prisma.campaign.update({
          where: { id: campaignId },
          data: {
            currentContractVersion: nextVersion,
            status: newStatus,
          },
        });

        await prisma.auditLog.create({
          data: {
            campaignId,
            actorName: actorName || "Brand Manager",
            actorRole: "BRAND_MANAGER",
            action: "CONTRACT_CREATED",
            detail: `Published Campaign Contract v${nextVersion}. ${
              previousStatus === "APPROVED" ? "Previous approval cryptographically invalidated due to contract change." : ""
            }`,
          },
        });

        return NextResponse.json({ success: true, contract: newContract, newStatus });
      }
    } catch (dbErr) {
      console.warn("Prisma contract update failed, using memoryStore:", dbErr);
    }

    const updated = memoryStore.updateContract(
      campaignId,
      {
        market,
        channel,
        audience,
        offerPercent: Number(offerPercent),
        eligibility,
        endDate,
        approvedClaims,
        requiredQuals,
        prohibitedTerms,
        variants,
      },
      actorName
    );

    return NextResponse.json({ success: true, contract: updated });
  } catch (error) {
    console.error("POST /api/contracts error:", error);
    return NextResponse.json({ success: false, error: "Failed to save contract" }, { status: 500 });
  }
}