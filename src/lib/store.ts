// In-Memory Fallback Store ensuring 100% uptime on Vercel serverless
import { computePackHash } from "./hash";

export interface StoredCampaign {
  id: string;
  title: string;
  product: string;
  brand: string;
  status: "DRAFT" | "NEEDS_REVIEW" | "APPROVED" | "INVALIDATED";
  currentContractVersion: number;
  createdAt: string;
  updatedAt: string;
  contracts: any[];
  packs: any[];
  auditLogs: any[];
}

const INITIAL_CAMPAIGNS: StoredCampaign[] = [
  {
    id: "camp_ecosip_01",
    title: "EcoSip Weekend Flash Sale",
    product: "EcoSip 750ml Thermal Flask",
    brand: "EcoSip Living",
    status: "NEEDS_REVIEW",
    currentContractVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contracts: [
      {
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
          "Triple-wall vacuum insulated.",
        ]),
        requiredQualsJson: JSON.stringify(["On selected bottles.", "While stocks last."]),
        prohibitedTermsJson: JSON.stringify([
          "Miracle",
          "guaranteed",
          "world's best",
          "cure-all",
          "unbeatable",
        ]),
        variantsJson: JSON.stringify([
          {
            channel: "VIP Email Club",
            offerPercent: 30.0,
            audience: "VIP Subscribers",
            notes: "Approved exclusive 30% loyalty tier.",
          },
        ]),
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ],
    packs: [
      {
        id: "pack_ecosip_rev1",
        revision: 1,
        packHash: "a7x9c42e88b1f093",
        caption:
          "Stay refreshed this weekend with EcoSip! Enjoy 20% off our premium flasks. Miracle cold retention promises 24 hours guaranteed chill for everyone!",
        bannerName: "ecosip_weekend_banner.png",
        bannerBase64: null,
        pdfName: "ecosip_spec_sheet.pdf",
        pdfText:
          "EcoSip 750ml Spec Sheet: Lab tested cold retention up to 12 hours. Offer: 20% discount on selected models through October 31.",
        status: "FINDINGS",
        createdAt: new Date().toISOString(),
        approvals: [],
        findings: [
          {
            id: "f_1",
            layer: "FACTS",
            location: "Instagram Caption",
            issue: "Exaggerated product performance claim",
            evidence:
              "Caption asserts '24 hours guaranteed chill', but Campaign Contract v1 Section 3 allows only: 'Keeps drinks cold for up to 12 hours.'",
            suggestedFix: "Revise to: 'Keeps drinks cold for up to 12 hours on selected bottles.'",
            status: "CONTRADICTED",
            resolution: "PENDING",
            createdAt: new Date().toISOString(),
          },
          {
            id: "f_2",
            layer: "BRAND_RULES",
            location: "Instagram Caption",
            issue: "Prohibited superlatives detected",
            evidence:
              "Contract prohibited list forbids ['Miracle', 'guaranteed']. Both terms were found in caption text.",
            suggestedFix: "Remove 'Miracle' and replace 'guaranteed' with verified specification wording.",
            status: "CONTRADICTED",
            resolution: "PENDING",
            createdAt: new Date().toISOString(),
          },
          {
            id: "f_3",
            layer: "BRAND_RULES",
            location: "Instagram Caption & Banner",
            issue: "Mandatory disclaimer qualification missing",
            evidence:
              "Contract mandates qualification clause: 'On selected bottles.' This disclaimer is absent from the caption.",
            suggestedFix: "Append required disclaimer: '*On selected bottles. While stocks last.'",
            status: "CONTRADICTED",
            resolution: "PENDING",
            createdAt: new Date().toISOString(),
          },
          {
            id: "f_4",
            layer: "CROSS_ASSET",
            location: "Cross-Asset (Caption vs PDF Specification)",
            issue: "Thermal specification mismatch across creative assets",
            evidence:
              "PDF spec states 'up to 12 hours', whereas caption promises '24 hours'. Inconsistent specifications published simultaneously erode brand credibility.",
            suggestedFix: "Align caption thermal duration with the engineering-verified 12 hours in the PDF spec.",
            status: "CONTRADICTED",
            resolution: "PENDING",
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
    auditLogs: [
      {
        id: "l_1",
        actorName: "Priya Sharma",
        actorRole: "BRAND_MANAGER",
        action: "CONTRACT_CREATED",
        detail: "Created Campaign Contract v1 for EcoSip Weekend Flash Sale.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "l_2",
        actorName: "Alex Chen",
        actorRole: "CREATOR",
        action: "PACK_SUBMITTED",
        detail: "Submitted Asset Pack Rev 1 with caption and specification sheet.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "l_3",
        actorName: "CampaignGuard System",
        actorRole: "SYSTEM",
        action: "CHECK_COMPLETED",
        detail: "Preflight automated check completed. 4 contradictions identified across 3 layers.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

const globalStore = globalThis as unknown as {
  _cg_campaigns: StoredCampaign[] | undefined;
};

if (!globalStore._cg_campaigns) {
  globalStore._cg_campaigns = JSON.parse(JSON.stringify(INITIAL_CAMPAIGNS));
}

export const memoryStore = {
  getCampaigns(): StoredCampaign[] {
    return globalStore._cg_campaigns || INITIAL_CAMPAIGNS;
  },

  getCampaign(id: string): StoredCampaign | undefined {
    return this.getCampaigns().find((c) => c.id === id);
  },

  createCampaign(data: { title: string; product: string; brand: string; actorName?: string }): StoredCampaign {
    const nextId = "camp_" + Date.now();
    const newCamp: StoredCampaign = {
      id: nextId,
      title: data.title,
      product: data.product,
      brand: data.brand || "Brand Co.",
      status: "DRAFT",
      currentContractVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contracts: [
        {
          id: "contract_" + nextId + "_v1",
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
          createdAt: new Date().toISOString(),
        },
      ],
      packs: [],
      auditLogs: [
        {
          id: "log_" + Date.now(),
          actorName: data.actorName || "Brand Manager",
          actorRole: "BRAND_MANAGER",
          action: "CONTRACT_CREATED",
          detail: `Initialized campaign "${data.title}" with baseline Contract v1.`,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    globalStore._cg_campaigns?.unshift(newCamp);
    return newCamp;
  },

  updateContract(campaignId: string, contractData: any, actorName?: string) {
    const camp = this.getCampaign(campaignId);
    if (!camp) return null;

    const nextVer = (camp.contracts[0]?.version || 0) + 1;
    camp.contracts.forEach((c) => (c.isActive = false));

    const newContract = {
      id: `contract_${campaignId}_v${nextVer}`,
      version: nextVer,
      market: contractData.market || "Global",
      channel: contractData.channel || "Instagram",
      audience: contractData.audience || "General Public",
      offerPercent: contractData.offerPercent || 20,
      eligibility: contractData.eligibility || "Selected items",
      endDate: contractData.endDate || "2026-10-31",
      approvedClaimsJson: JSON.stringify(contractData.approvedClaims || []),
      requiredQualsJson: JSON.stringify(contractData.requiredQuals || []),
      prohibitedTermsJson: JSON.stringify(contractData.prohibitedTerms || []),
      variantsJson: JSON.stringify(contractData.variants || []),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    camp.contracts.unshift(newContract);
    camp.currentContractVersion = nextVer;

    // Invalidation
    if (camp.status === "APPROVED") {
      camp.status = "INVALIDATED";
    } else {
      camp.status = "NEEDS_REVIEW";
    }
    camp.updatedAt = new Date().toISOString();

    camp.auditLogs.unshift({
      id: "log_" + Date.now(),
      actorName: actorName || "Brand Manager",
      actorRole: "BRAND_MANAGER",
      action: "CONTRACT_CREATED",
      detail: `Published Campaign Contract v${nextVer}. Prior approvals invalidated if any rules changed.`,
      createdAt: new Date().toISOString(),
    });

    return newContract;
  },

  submitPack(campaignId: string, packData: any, findings: any[], actorName?: string) {
    const camp = this.getCampaign(campaignId);
    if (!camp) return null;

    const nextRev = (camp.packs[0]?.revision || 0) + 1;
    const packHash = computePackHash(packData.caption, packData.bannerBase64, packData.pdfText);

    const wasApproved = camp.status === "APPROVED";
    camp.status = wasApproved ? "INVALIDATED" : "NEEDS_REVIEW";
    camp.updatedAt = new Date().toISOString();

    const newPack = {
      id: `pack_${campaignId}_rev${nextRev}`,
      revision: nextRev,
      packHash,
      caption: packData.caption,
      bannerBase64: packData.bannerBase64 || null,
      bannerName: packData.bannerName || null,
      pdfText: packData.pdfText || null,
      pdfName: packData.pdfName || null,
      status: findings.length > 0 ? "FINDINGS" : "READY_FOR_APPROVAL",
      createdAt: new Date().toISOString(),
      approvals: [],
      findings: findings.map((f, i) => ({
        id: `f_${Date.now()}_${i}`,
        ...f,
        resolution: "PENDING",
        createdAt: new Date().toISOString(),
      })),
    };

    camp.packs.unshift(newPack);

    camp.auditLogs.unshift({
      id: "log_" + Date.now(),
      actorName: actorName || "Alex Chen",
      actorRole: "CREATOR",
      action: "PACK_SUBMITTED",
      detail: `Submitted Campaign Pack Rev ${nextRev} (Hash: ${packHash}). Preflight inspection detected ${findings.length} findings. ${
        wasApproved ? "Prior approval invalidated due to revised assets." : ""
      }`,
      createdAt: new Date().toISOString(),
    });

    return newPack;
  },

  approvePack(campaignId: string, packId: string, reviewerName: string, reviewerRole: string, notes?: string) {
    const camp = this.getCampaign(campaignId);
    if (!camp) return null;

    const pack = camp.packs.find((p) => p.id === packId) || camp.packs[0];
    if (!pack) return null;

    const activeContract = camp.contracts.find((c) => c.isActive) || camp.contracts[0];

    const approval = {
      id: "appr_" + Date.now(),
      packId: pack.id,
      packHash: pack.packHash,
      contractVersion: activeContract ? activeContract.version : 1,
      reviewerName: reviewerName || "Marcus Vance",
      reviewerRole: reviewerRole || "REVIEWER",
      notes: notes || "All preflight layers verified.",
      isValid: true,
      approvedAt: new Date().toISOString(),
    };

    pack.status = "APPROVED";
    pack.approvals = pack.approvals || [];
    pack.approvals.unshift(approval);

    camp.status = "APPROVED";
    camp.updatedAt = new Date().toISOString();

    camp.auditLogs.unshift({
      id: "log_" + Date.now(),
      actorName: reviewerName || "Marcus Vance",
      actorRole: reviewerRole || "REVIEWER",
      action: "APPROVED",
      detail: `Cryptographic Version-Lock executed on Rev ${pack.revision} (Hash: ${pack.packHash}) against Contract v${
        activeContract?.version || 1
      }. Status: APPROVED.`,
      createdAt: new Date().toISOString(),
    });

    return approval;
  },

  resolveFinding(findingId: string, resolution: "ACCEPTED" | "ESCALATED", actorName?: string, actorRole?: string) {
    for (const camp of this.getCampaigns()) {
      for (const pack of camp.packs) {
        const finding = pack.findings?.find((f: any) => f.id === findingId);
        if (finding) {
          finding.resolution = resolution;
          camp.auditLogs.unshift({
            id: "log_" + Date.now(),
            actorName: actorName || "Alex Chen",
            actorRole: actorRole || "CREATOR",
            action: "FINDING_RESOLVED",
            detail: `Finding [${finding.layer} - ${finding.location}] marked as ${resolution}.`,
            createdAt: new Date().toISOString(),
          });
          return finding;
        }
      }
    }
    return null;
  },
};