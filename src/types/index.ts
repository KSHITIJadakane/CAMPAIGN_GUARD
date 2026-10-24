export type Role = "BRAND_MANAGER" | "CREATOR" | "REVIEWER";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  description: string;
}

export type CampaignStatus = "DRAFT" | "NEEDS_REVIEW" | "APPROVED" | "INVALIDATED";

export interface CampaignVariant {
  channel: string;
  offerPercent: number;
  audience?: string;
  notes?: string;
}

export interface ContractData {
  id?: string;
  campaignId: string;
  version: number;
  market: string;
  channel: string;
  audience: string;
  offerPercent: number;
  eligibility: string;
  endDate: string;
  approvedClaims: string[];
  requiredQuals: string[];
  prohibitedTerms: string[];
  variants: CampaignVariant[];
  isActive: boolean;
  createdAt?: string;
}

export type CheckLayer = "FACTS" | "CROSS_ASSET" | "BRAND_RULES" | "ACCESSIBILITY";
export type FindingStatus = "CONTRADICTED" | "INSUFFICIENT_EVIDENCE" | "SUPPORTED";
export type ResolutionStatus = "PENDING" | "ACCEPTED" | "ESCALATED";

export interface FindingItem {
  id?: string;
  packId?: string;
  layer: CheckLayer;
  location: string;
  issue: string;
  evidence: string;
  suggestedFix: string;
  status: FindingStatus;
  resolution?: ResolutionStatus;
  createdAt?: string;
}

export interface PreflightReport {
  packHash: string;
  revision: number;
  overallStatus: "READY_FOR_APPROVAL" | "NEEDS_FIXES";
  layerSummaries: {
    layer: CheckLayer;
    title: string;
    passed: boolean;
    issuesCount: number;
    description: string;
  }[];
  findings: FindingItem[];
}
