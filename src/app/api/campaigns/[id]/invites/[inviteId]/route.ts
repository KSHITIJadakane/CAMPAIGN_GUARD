import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; inviteId: string } }
) {
  try {
    const { id: campaignId, inviteId } = params;
    const body = await req.json().catch(() => ({}));
    const actorName = body.actorName || "Brand Manager";

    const ok = memoryStore.revokeInvite(campaignId, inviteId, actorName);
    if (!ok) {
      return NextResponse.json(
        { error: "Could not revoke invitation. Invite not found or not pending." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invitation successfully revoked.",
    });
  } catch (error) {
    console.error("Failed to revoke invite:", error);
    return NextResponse.json({ error: "Failed to revoke invitation" }, { status: 500 });
  }
}
