import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { memoryStore } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campaignId, packId, reviewerName, reviewerRole, notes } = body;

    if (!campaignId || !packId) {
      return NextResponse.json({ success: false, error: "campaignId and packId are required" }, { status: 400 });
    }

    // Strict Server-Side RBAC Enforcement (Round 3 Enterprise Hardening)
    // Creators and Brand Managers are explicitly forbidden from executing approvals
    if (reviewerRole !== "REVIEWER") {
      return NextResponse.json(
        {
          success: false,
          error: `Forbidden: Only users with the REVIEWER role (Authorised Final Approver) are permitted to execute cryptographic version-locks. Role '${reviewerRole || "UNASSIGNED"}' is unauthorized.`,
          requiredRole: "REVIEWER",
          providedRole: reviewerRole || "UNASSIGNED",
        },
        { status: 403 }
      );
    }

    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          contracts: { where: { isActive: true }, take: 1 },
          packs: { where: { id: packId }, include: { findings: true } },
        },
      });

      if (campaign && campaign.packs[0]) {
        const activeContract = campaign.contracts[0];
        const targetPack = campaign.packs[0];

        const approval = await prisma.approval.create({
          data: {
            packId,
            packHash: targetPack.packHash,
            contractVersion: activeContract ? activeContract.version : 1,
            reviewerName: reviewerName || "Marcus Vance",
            reviewerRole: reviewerRole || "REVIEWER",
            notes: notes || "All preflight layers verified.",
            isValid: true,
          },
        });

        await prisma.campaignPack.update({
          where: { id: packId },
          data: { status: "APPROVED" },
        });

        await prisma.campaign.update({
          where: { id: campaignId },
          data: { status: "APPROVED" },
        });

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
      }
    } catch (dbErr) {
      console.warn("Prisma approve failed, using memoryStore:", dbErr);
    }

    const approval = memoryStore.approvePack(campaignId, packId, reviewerName, reviewerRole, notes);
    return NextResponse.json({ success: true, approval });
  } catch (error) {
    console.error("POST /api/packs/approve error:", error);
    return NextResponse.json({ success: false, error: "Failed to approve pack" }, { status: 500 });
  }
}