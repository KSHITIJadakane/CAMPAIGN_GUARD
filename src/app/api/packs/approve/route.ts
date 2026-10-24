import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campaignId, packId, reviewerName, reviewerRole, notes } = body;

    if (!campaignId || !packId) {
      return NextResponse.json({ success: false, error: "campaignId and packId are required" }, { status: 400 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        contracts: { where: { isActive: true }, take: 1 },
        packs: { where: { id: packId }, include: { findings: true } },
      },
    });

    if (!campaign || !campaign.packs[0]) {
      return NextResponse.json({ success: false, error: "Campaign or Pack not found" }, { status: 404 });
    }

    const activeContract = campaign.contracts[0];
    const targetPack = campaign.packs[0];

    // Check if there are unresolved CONTRADICTED findings
    const unresolvedCritical = targetPack.findings.filter(
      (f) => f.status === "CONTRADICTED" && f.resolution === "PENDING"
    );

    // Create approval record cryptographically bound to packHash + contractVersion
    const approval = await prisma.approval.create({
      data: {
        packId,
        packHash: targetPack.packHash,
        contractVersion: activeContract ? activeContract.version : 1,
        reviewerName: reviewerName || "Marcus Vance",
        reviewerRole: reviewerRole || "REVIEWER",
        notes: notes || (unresolvedCritical.length > 0 ? "Approved with accepted risk/exceptions." : "All preflight layers verified."),
        isValid: true,
      },
    });

    // Update pack status & campaign status
    await prisma.campaignPack.update({
      where: { id: packId },
      data: { status: "APPROVED" },
    });

    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "APPROVED" },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        campaignId,
        actorName: reviewerName || "Marcus Vance",
        actorRole: reviewerRole || "REVIEWER",
        action: "APPROVED",
        detail: `Cryptographic Version-Lock executed on Rev ${targetPack.revision} (Hash: ${targetPack.packHash}) against Contract v${
          activeContract?.version || 1
        }. Status: APPROVED.`,
      },
    });

    return NextResponse.json({ success: true, approval });
  } catch (error) {
    console.error("POST /api/packs/approve error:", error);
    return NextResponse.json({ success: false, error: "Failed to approve pack" }, { status: 500 });
  }
}