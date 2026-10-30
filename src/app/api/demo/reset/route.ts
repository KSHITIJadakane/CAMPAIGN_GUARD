import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetCampaignId = body?.campaignId || "camp_ecosip_01";

    // Demo Endpoint Protection: Restrict reset strictly to benchmark scenarios
    if (targetCampaignId !== "camp_ecosip_01") {
      return NextResponse.json(
        {
          success: false,
          error: `Forbidden: State reset is strictly restricted to the designated evaluation benchmark scenario ('camp_ecosip_01'). Production and custom campaign IDs ('${targetCampaignId}') cannot be reset.`,
          allowedBenchmark: "camp_ecosip_01",
        },
        { status: 403 }
      );
    }

    const memoryCampaign = memoryStore.resetDemo();

    try {
      // Find extra packs created for camp_ecosip_01 (revision > 1) and delete them
      const extraPacks = await prisma.campaignPack.findMany({
        where: {
          campaignId: "camp_ecosip_01",
          revision: { gt: 1 },
        },
      });

      for (const p of extraPacks) {
        await prisma.approval.deleteMany({ where: { packId: p.id } });
        await prisma.finding.deleteMany({ where: { packId: p.id } });
        await prisma.campaignPack.delete({ where: { id: p.id } });
      }

      // Reset approvals for pack 1
      const pack1 = await prisma.campaignPack.findFirst({
        where: { campaignId: "camp_ecosip_01", revision: 1 },
      });
      if (pack1) {
        await prisma.approval.deleteMany({ where: { packId: pack1.id } });
        await prisma.campaignPack.update({
          where: { id: pack1.id },
          data: { status: "FINDINGS" },
        });
        // Reset findings to PENDING
        await prisma.finding.updateMany({
          where: { packId: pack1.id },
          data: { resolution: "PENDING" },
        });
      }

      // Reset campaign status to NEEDS_REVIEW
      await prisma.campaign.update({
        where: { id: "camp_ecosip_01" },
        data: { status: "NEEDS_REVIEW" },
      });

      // Add audit log
      await prisma.auditLog.create({
        data: {
          campaignId: "camp_ecosip_01",
          actorName: "Judge / System Admin",
          actorRole: "SYSTEM",
          action: "DEMO_RESET",
          detail: "Demo benchmark reset to initial state with pre-seeded contradictions.",
        },
      });
    } catch (dbErr) {
      console.warn("Prisma demo reset failed, using memoryStore only:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "EcoSip demo benchmark reset to initial pre-seeded state",
      campaign: memoryCampaign,
    });
  } catch (error) {
    console.error("POST /api/demo/reset error:", error);
    return NextResponse.json({ success: false, error: "Failed to reset demo" }, { status: 500 });
  }
}
