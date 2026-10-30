import { NextRequest, NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";
import { Role } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;
    const campaign = memoryStore.getCampaign(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        members: campaign.members || [],
        invites: campaign.invites || [],
      },
    });
  } catch (error) {
    console.error("Failed to fetch campaign invites:", error);
    return NextResponse.json({ error: "Failed to fetch invites" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;
    const body = await req.json();
    const { email, role, actorName } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    if (!["CREATOR", "REVIEWER"].includes(role)) {
      return NextResponse.json(
        { error: "Invited role must be CREATOR or REVIEWER" },
        { status: 400 }
      );
    }

    const invite = memoryStore.createInvite(
      campaignId,
      email,
      role as Role,
      actorName || "Brand Manager"
    );

    if (!invite) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: invite,
      message: `Invitation generated for ${email} as ${role}.`,
    });
  } catch (error) {
    console.error("Failed to create campaign invite:", error);
    return NextResponse.json({ error: "Failed to create invite" }, { status: 500 });
  }
}
