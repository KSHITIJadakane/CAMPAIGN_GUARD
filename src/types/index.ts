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
  // Normalized 0-1000 [ymin, xmin, ymax, xmax] for visual coordinates on banner
  box2d?: [number, number, number, number] | null;
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

// === ROUND 3 FEATURE 1: MULTI-ROLE INVITATIONS & MEMBERSHIP ===
export interface CampaignMember {
  id: string;
  campaignId: string;
  email: string;
  name: string;
  role: Role;
  joinedAt: string;
}

export interface CampaignInvite {
  id: string;
  campaignId: string;
  token: string;
  email: string;
  role: Role;
  status: "PENDING" | "ACCEPTED" | "REVOKED";
  expiresAt: string;
  createdAt: string;
}

// === ROUND 3 FEATURE 2: EVIDENCE-LINKED CHANGE ORDERS ===
export type IssueResolutionStatus = "OPEN" | "RESOLVED" | "STILL_PRESENT" | "NEEDS_HUMAN_REVIEW";

export interface ChangeOrderIssue {
  id: string;
  findingId?: string;
  layer: CheckLayer;
  location: string;
  issue: string;
  evidence: string;
  suggestedFix: string;
  box2d?: [number, number, number, number] | null;
  status: IssueResolutionStatus;
}

export interface ChangeOrder {
  id: string;
  campaignId: string;
  packId: string;
  revision: number;
  assignedCreator: string;
  status: "OPEN" | "IN_PROGRESS" | "SUBMITTED" | "RESOLVED";
  designerNote?: string;
  issues: ChangeOrderIssue[];
  createdAt: string;
  updatedAt: string;
}

// === ROUND 3 FEATURE 3: GOVERNANCE ANALYTICS ===
export interface GovernanceKPIs {
  totalCampaignsAudited: number;
  confirmedViolations: number;
  firstPassApprovalRate: number; // percentage 0 - 100
  averageCorrectionRounds: number;
  sealedCampaignsCount: number;
}

export interface CategoryViolationStat {
  category: CheckLayer;
  label: string;
  count: number;
  percentage: number;
}

export interface CampaignComplianceRow {
  campaignId: string;
  title: string;
  status: CampaignStatus;
  violationsCount: number;
  revision: number;
  contractVersion: number;
  lastUpdated: string;
}

export interface WorkflowBottleneck {
  role: Role;
  waitingCount: number;
  avgWaitHours: number;
  oldestItemTitle: string;
}

export interface GovernanceAnalyticsData {
  kpis: GovernanceKPIs;
  violationsByCategory: CategoryViolationStat[];
  campaignsComparison: CampaignComplianceRow[];
  bottlenecks: WorkflowBottleneck[];
}
