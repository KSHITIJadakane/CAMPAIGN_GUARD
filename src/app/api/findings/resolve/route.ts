import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { findingId, resolution, actorName, actorRole } = body;

    if (!findingId || !resolution) {
      return NextResponse.json({ success: false, error: "findingId and resolution are required" }, { status: 400 });
    }

    const finding = await prisma.finding.update({
      where: { id: findingId },
      data: { resolution },
      include: {
        pack: {
          include: { campaign: true },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        campaignId: finding.pack.campaignId,
        actorName: actorName || "Alex Chen",
        actorRole: actorRole || "CREATOR",
        action: "FINDING_RESOLVED",
        detail: `Finding [${finding.layer} - ${finding.location}] marked as ${resolution}.`,
      },
    });

    return NextResponse.json({ success: true, finding });
  } catch (error) {
    console.error("PATCH /api/findings/resolve error:", error);
    return NextResponse.json({ success: false, error: "Failed to resolve finding" }, { status: 500 });
  }
}