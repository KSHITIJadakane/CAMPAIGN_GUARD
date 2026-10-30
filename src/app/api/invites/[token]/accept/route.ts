import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const found = memoryStore.getInviteByToken(token);

    if (!found) {
      return NextResponse.json(
        { error: "Invalid or expired invitation token." },
        { status: 404 }
      );
    }

    const { invite, campaign } = found;

    if (invite.status === "REVOKED") {
      return NextResponse.json(
        { error: "This invitation token has been revoked by the campaign administrator." },
        { status: 410 }
      );
    }

    if (invite.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "This invitation token has already been accepted and cannot be reused." },
        { status: 409 }
      );
    }

    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "This invitation token has expired (7-day validity window exceeded)." },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        invite,
        campaign: {
          id: campaign.id,
          title: campaign.title,
          product: campaign.product,
          brand: campaign.brand,
          status: campaign.status,
        },
      },
    });
  } catch (error) {
    console.error("Failed to verify invite token:", error);
    return NextResponse.json(
      { error: "Failed to verify invitation" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const body = await req.json().catch(() => ({}));
    const userName = body.userName || "Invited Collaborator";

    const found = memoryStore.getInviteByToken(token);
    if (!found) {
      return NextResponse.json(
        { error: "Invitation token not found or invalid." },
        { status: 404 }
      );
    }

    const { invite } = found;
    if (invite.status === "REVOKED") {
      return NextResponse.json(
        { error: "Invitation token was revoked by the campaign administrator." },
        { status: 410 }
      );
    }

    if (invite.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "Invitation token has already been accepted and cannot be reused." },
        { status: 409 }
      );
    }

    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Invitation token has expired (7-day validity limit exceeded)." },
        { status: 410 }
      );
    }

    const result = memoryStore.acceptInvite(token, userName);

    if (!result) {
      return NextResponse.json(
        { error: "Invitation is invalid, expired, or already accepted." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        member: result.member,
        campaignId: result.campaign.id,
        role: result.member.role,
      },
      message: `Invitation accepted! Joined ${result.campaign.title} as ${result.member.role}.`,
    });
  } catch (error) {
    console.error("Failed to accept invite:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}
