import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";
import { memoryStore } from "@/lib/store";

export async function GET() {
  try {
    try {
      await seedDatabase();

      const campaigns = await prisma.campaign.findMany({
        include: {
          contracts: {
            orderBy: { version: "desc" },
          },
          packs: {
            orderBy: { revision: "desc" },
            include: {
              findings: true,
              approvals: {
                orderBy: { approvedAt: "desc" },
              },
            },
          },
          auditLogs: {
            orderBy: { createdAt: "desc" },
            take: 15,
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      if (campaigns && campaigns.length > 0) {
        const enriched = campaigns.map((c) => {
          const mem = memoryStore.getCampaign(c.id);
          return {
            ...c,
            members: mem?.members || [],
            invites: mem?.invites || [],
            changeOrders: mem?.changeOrders || [],
          };
        });
        return NextResponse.json({ success: true, campaigns: enriched });
      }
    } catch (dbErr) {
      console.warn("Prisma query failed, falling back to memory store:", dbErr);
    }

    // High-reliability fallback for Vercel serverless
    const campaigns = memoryStore.getCampaigns();
    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    console.error("GET /api/campaigns error:", error);
    return NextResponse.json({ success: true, campaigns: memoryStore.getCampaigns() });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, product, brand, role, actorName } = body;

    if (!title || !product) {
      return NextResponse.json({ success: false, error: "Title and product are required" }, { status: 400 });
    }

    try {
      const campaign = await prisma.campaign.create({
        data: {
          title,
          product,
          brand: brand || "Brand Co.",
          status: "DRAFT",
          currentContractVersion: 1,
          contracts: {
            create: {
              version: 1,
              market: "Global",
              channel: "Instagram",
              audience: "General Audience",
              offerPercent: 20.0,
              eligibility: "Selected catalog items",
              endDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
              approvedClaimsJson: JSON.stringify(["Premium quality guaranteed."]),
              requiredQualsJson: JSON.stringify(["While supplies last."]),
              prohibitedTermsJson: JSON.stringify(["Miracle", "guaranteed", "cheapest"]),
              variantsJson: JSON.stringify([]),
              isActive: true,
            },
          },
          auditLogs: {
            create: {
              actorName: actorName || "Brand Manager",
              actorRole: role || "BRAND_MANAGER",
              action: "CONTRACT_CREATED",
              detail: `Initialized campaign "${title}" with baseline Contract v1.`,
            },
          },
        },
        include: {
          contracts: true,
        },
      });

      return NextResponse.json({ success: true, campaign });
    } catch (dbErr) {
      console.warn("Prisma create failed, falling back to memoryStore:", dbErr);
    }

    const campaign = memoryStore.createCampaign({ title, product, brand, actorName });
    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("POST /api/campaigns error:", error);
    return NextResponse.json({ success: false, error: "Failed to create campaign" }, { status: 500 });
  }
}