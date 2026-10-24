import { prisma } from "./prisma";

export const DEMO_USERS = [
  {
    id: "user_bm_1",
    name: "Priya Sharma",
    email: "priya@ecosip.co",
    role: "BRAND_MANAGER" as const,
    title: "Brand Governance Director",
    description: "Defines Campaign Contracts, sets variant rules, and configures truth parameters."
  },
  {
    id: "user_cr_1",
    name: "Alex Chen",
    email: "alex.creator@ecosip.co",
    role: "CREATOR" as const,
    title: "Senior Copy & Asset Creator",
    description: "Submits campaign packs (captions, banners, PDFs) and resolves preflight findings."
  },
  {
    id: "user_rev_1",
    name: "Marcus Vance",
    email: "marcus.legal@ecosip.co",
    role: "REVIEWER" as const,
    title: "Authorised Final Approver",
    description: "Validates evidence and executes cryptographic version-locks on approved assets."
  }
];

export async function seedDatabase() {
  const existingUsers = await prisma.user.count();
  if (existingUsers === 0) {
    for (const u of DEMO_USERS) {
      await prisma.user.create({
        data: {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role
        }
      });
    }
  }

  const existingCampaign = await prisma.campaign.findFirst({
    where: { id: "camp_ecosip_01" }
  });

  if (!existingCampaign) {
    await prisma.campaign.create({
      data: {
        id: "camp_ecosip_01",
        title: "EcoSip Weekend Flash Sale",
        product: "EcoSip 750ml Thermal Flask",
        brand: "EcoSip Living",
        status: "NEEDS_REVIEW",
        currentContractVersion: 1,
        contracts: {
          create: {
            id: "contract_ecosip_v1",
            version: 1,
            market: "India & Global",
            channel: "Instagram",
            audience: "General Public",
            offerPercent: 20.0,
            eligibility: "Selected bottles only",
            endDate: "2026-10-31",
            approvedClaimsJson: JSON.stringify([
              "Keeps drinks cold for up to 12 hours.",
              "100% BPA-Free recycled stainless steel.",
              "Triple-wall vacuum insulated."
            ]),
            requiredQualsJson: JSON.stringify([
              "On selected bottles.",
              "While stocks last."
            ]),
            prohibitedTermsJson: JSON.stringify([
              "Miracle",
              "guaranteed",
              "world's best",
              "cure-all",
              "unbeatable"
            ]),
            variantsJson: JSON.stringify([
              {
                channel: "VIP Email Club",
                offerPercent: 30.0,
                audience: "VIP Subscribers",
                notes: "Approved exclusive 30% loyalty tier."
              }
            ]),
            isActive: true
          }
        },
        packs: {
          create: {
            id: "pack_ecosip_rev1",
            revision: 1,
            packHash: "a7x9c42e88b1f093",
            caption: "Stay refreshed this weekend with EcoSip! Enjoy 20% off our premium flasks. Miracle cold retention promises 24 hours guaranteed chill for everyone!",
            bannerName: "ecosip_weekend_banner.png",
            bannerBase64: null,
            pdfName: "ecosip_spec_sheet.pdf",
            pdfText: "EcoSip 750ml Spec Sheet: Lab tested cold retention up to 12 hours. Offer: 20% discount on selected models through October 31.",
            status: "FINDINGS",
            findings: {
              create: [
                {
                  layer: "FACTS",
                  location: "Instagram Caption",
                  issue: "Exaggerated product performance claim",
                  evidence: "Caption asserts '24 hours guaranteed chill', but Campaign Contract v1 Section 3 allows only: 'Keeps drinks cold for up to 12 hours.'",
                  suggestedFix: "Revise to: 'Keeps drinks cold for up to 12 hours on selected bottles.'",
                  status: "CONTRADICTED",
                  resolution: "PENDING"
                },
                {
                  layer: "BRAND_RULES",
                  location: "Instagram Caption",
                  issue: "Prohibited superlatives detected",
                  evidence: "Contract prohibited list forbids ['Miracle', 'guaranteed']. Both terms were found in caption text.",
                  suggestedFix: "Remove 'Miracle' and replace 'guaranteed' with verified specification wording.",
                  status: "CONTRADICTED",
                  resolution: "PENDING"
                },
                {
                  layer: "BRAND_RULES",
                  location: "Instagram Caption & Banner",
                  issue: "Mandatory disclaimer qualification missing",
                  evidence: "Contract mandates qualification clause: 'On selected bottles.' This disclaimer is absent from the caption.",
                  suggestedFix: "Append required disclaimer: '*On selected bottles. While stocks last.'",
                  status: "CONTRADICTED",
                  resolution: "PENDING"
                },
                {
                  layer: "CROSS_ASSET",
                  location: "Cross-Asset (Caption vs PDF Specification)",
                  issue: "Thermal specification mismatch across creative assets",
                  evidence: "PDF spec states 'up to 12 hours', whereas caption promises '24 hours'. Inconsistent specifications published simultaneously erode brand credibility.",
                  suggestedFix: "Align caption thermal duration with the engineering-verified 12 hours in the PDF spec.",
                  status: "CONTRADICTED",
                  resolution: "PENDING"
                }
              ]
            }
          }
        },
        auditLogs: {
          create: [
            {
              actorName: "Priya Sharma",
              actorRole: "BRAND_MANAGER",
              action: "CONTRACT_CREATED",
              detail: "Created Campaign Contract v1 for EcoSip Weekend Flash Sale."
            },
            {
              actorName: "Alex Chen",
              actorRole: "CREATOR",
              action: "PACK_SUBMITTED",
              detail: "Submitted Asset Pack Rev 1 with caption and specification sheet."
            },
            {
              actorName: "CampaignGuard System",
              actorRole: "SYSTEM",
              action: "CHECK_COMPLETED",
              detail: "Preflight automated check completed. 4 contradictions identified across 3 layers."
            }
          ]
        }
      }
    });
  }
}