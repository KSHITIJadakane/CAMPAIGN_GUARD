import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/store";

export async function GET() {
  try {
    const analytics = memoryStore.getGovernanceAnalytics();
    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Failed to fetch governance analytics:", error);
    return NextResponse.json(
      { error: "Failed to compile governance analytics" },
      { status: 500 }
    );
  }
}
