# Architecture.md — CampaignGuard
> System Architecture, Data Flow & Technical Stack | Round 3 Finalist Enterprise Build

---

## 1. High-Level System Architecture

CampaignGuard is architected as an end-to-end brand governance and visual preflight platform built on Next.js 14 App Router with TypeScript.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT TIER (React 18)                           │
│  ┌──────────────────────┬──────────────────────┬─────────────────────────┐  │
│  │ Brand Manager Portal │   Creator Studio     │  Reviewer Verification  │  │
│  │ • Contract Builder   │ • Asset Uploader     │ • Evidence Comparator   │  │
│  │ • Invite Generator   │ • Visual Annotations │ • SHA-256 Version Lock  │  │
│  │ • Governance Center  │ • Change Order Tasks │ • Invalidation Alerts   │  │
│  └──────────────────────┴──────────────────────┴─────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │              UNIFIED STATE, ROUTING & RBAC MIDDLEWARE                 │  │
│  │ • Dynamic Route Handlers (`/dashboard`, `/invite`, `/api/*`)          │  │
│  │ • Campaign-Scoped Role Authorization & Tokenized Invitation System    │  │
│  │ • Quick Judge Persona Switcher for Zero-Setup Evaluation              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PREFLIGHT ENGINE (Hybrid)                           │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────────┐  │
│  │      DETERMINISTIC VERIFIER     │   │      GEMINI 1.5 FLASH VISION    │  │
│  │  • Regex math & numeric bounds  │   │  • Multimodal visual OCR        │  │
│  │  • Expiration date validation   │   │  • Spatial box_2d extraction    │  │
│  │  • Prohibited terms detector    │   │  • Cross-asset contradiction    │  │
│  │  • Mandatory qualifier scanner  │   │  • Strict JSON schema parsing   │  │
│  └─────────────────────────────────┘   └─────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │             ACTIONABLE REMEDIATION & GOVERNANCE LIFECYCLE             │  │
│  │  • Grouped Change Order Tickets (Revision v1 → v2 re-analysis)        │  │
│  │  • Interactive SVG/Canvas Bounding-Box Overlay Engine                 │  │
│  │  • SHA-256 Revision Hash Generation & Drift Detection                 │  │
│  │  • Real-Time Cross-Campaign Governance Analytics Aggregator           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DATA & INTEGRITY TIER (Authoritative)                   │
│  • Dual Architecture:                                                       │
│    - Rapid Evaluation: In-memory pre-seeded store for zero-setup demo tests │
│    - Durable Deployment: Prisma ORM relational models (SQLite / PostgreSQL) │
│  • Immutable Audit Trail with cryptographic SHA-256 asset hash binding      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Round 3 Feature Architectures

### Feature 1: Multi-Role Access Control & Campaign Invites
- **Invite Token Pipeline:**
  1. Brand Manager issues invite via `POST /api/campaigns/[id]/invites` specifying `email` and target `role` (`CREATOR` or `REVIEWER`).
  2. Server generates a cryptographically random token (`inv_...`) bound to the campaign, role, and expiration window.
  3. Generates shareable URL: `/invite?token=inv_...`.
  4. Recipient visits `/invite`, inspects campaign metadata, and clicks **"Accept & Enter Workspace"** via `POST /api/invites/[token]/accept`.
  5. Session switches to the campaign-scoped role. Creators are restricted from editing contracts or signing approval locks; Reviewers are restricted from modifying asset files.
  6. **Server-Side Membership Roster Verification:** `/api/packs/approve` cross-references caller identity against the campaign's registered membership roster (`campaign.members`). Any client attempting role spoofing (e.g., an enrolled Creator passing `reviewerRole: "REVIEWER"`) is strictly rejected with HTTP `403 Forbidden`.

### Feature 2: Visual OCR & Evidence-Linked Change Orders
- **Spatial Bounding-Box Detection:**
  1. Multimodal request sent to Gemini with instructions to locate contradicting elements on banner imagery.
  2. Model returns coordinates in normalized format: `box_2d: [ymin, xmin, ymax, xmax]` ($0 \dots 1000$).
  3. `AnnotatedCreativeViewer` maps coordinates dynamically to relative container percentages (`top`, `left`, `width`, `height`).
  4. Bidirectional binding: Hovering or clicking a bounding box highlights the corresponding finding card; clicking a finding focuses the bounding box on the graphic.
- **Change Order & Re-Analysis Pipeline:**
  1. Findings for asset revision $N$ are grouped into a single **Change Order Ticket**.
  2. Assigned Creator reviews visual annotations and uploads revision $N+1$ with a **Designer Correction Note**.
  3. Preflight engine re-analyzes revision $N+1$ and executes issue-matching:
     - Discrepancy resolved $\rightarrow$ status `RESOLVED`.
     - Discrepancy persists $\rightarrow$ status `STILL_PRESENT`.
     - Ambiguous match $\rightarrow$ status `NEEDS_HUMAN_REVIEW`.
  4. Reviewer inspects side-by-side comparison before executing cryptographic seal.

### Feature 3: Cross-Campaign Governance Analytics Dashboard
- **Real-Time Aggregation Service (`src/lib/analytics.ts`):**
  - **KPI 1: Campaigns Audited:** Active campaigns with executed preflight audits.
  - **KPI 2: Confirmed Violations:** Pre-publication contradictions caught across all active packs.
  - **KPI 3: First-Pass Approval Rate (%):** Percentage of assets approved at Rev 1 without revisions.
  - **KPI 4: Average Revision Cycles:** Mean correction rounds required to reach sign-off.
  - **KPI 5: Cryptographically Sealed Vault:** Approved SHA-256 version-locked packs.
  - **Bottleneck Intelligence:** Real-time workflow tracker computing wait times by role (waiting on Creator revision vs Reviewer signoff) — an operational tracker distinct from the 5 governance KPIs.

---

## 3. Data Schema & Models

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      String   // "BRAND_MANAGER" | "CREATOR" | "REVIEWER"
  createdAt DateTime @default(now())
}

model Campaign {
  id                     String           @id @default(cuid())
  title                  String
  product                String
  brand                  String
  status                 String           @default("DRAFT")
  currentContractVersion Int              @default(1)
  contracts              Contract[]
  packs                  CampaignPack[]
  members                CampaignMember[]
  invites                CampaignInvite[]
  changeOrders           ChangeOrder[]
  auditLogs              AuditLog[]
  createdAt              DateTime         @default(now())
  updatedAt              DateTime         @updatedAt
}

model CampaignMember {
  id         String   @id @default(cuid())
  campaignId String
  email      String
  name       String
  role       String   // "BRAND_MANAGER" | "CREATOR" | "REVIEWER"
  joinedAt   DateTime @default(now())
}

model CampaignInvite {
  id         String   @id @default(cuid())
  campaignId String
  token      String   @unique
  email      String
  role       String
  status     String   // "PENDING" | "ACCEPTED" | "REVOKED"
  expiresAt  DateTime
  createdAt  DateTime @default(now())
}

model CampaignPack {
  id           String        @id @default(cuid())
  campaignId   String
  revision     Int           @default(1)
  packHash     String        // SHA-256 of combined assets
  caption      String
  bannerBase64 String?
  bannerName   String?
  pdfText      String?
  pdfName      String?
  status       String        @default("PENDING")
  findings     Finding[]
  changeOrders ChangeOrder[]
  approvals    Approval[]
  createdAt    DateTime      @default(now())
}

model Finding {
  id           String   @id @default(cuid())
  packId       String
  layer        String   // "FACTS" | "CROSS_ASSET" | "BRAND_RULES" | "ACCESSIBILITY"
  location     String
  issue        String
  evidence     String
  suggestedFix String
  status       String   // "CONTRADICTED" | "INSUFFICIENT_EVIDENCE" | "SUPPORTED"
  resolution   String   @default("PENDING")
  box2dJson    String?  // JSON [ymin, xmin, ymax, xmax] normalized 0-1000
  createdAt    DateTime @default(now())
}

model ChangeOrder {
  id              String             @id @default(cuid())
  campaignId      String
  packId          String
  revision        Int
  assignedCreator String
  status          String             // "OPEN" | "SUBMITTED" | "RESOLVED"
  designerNote    String?
  issues          ChangeOrderIssue[]
  createdAt       DateTime           @default(now())
}

model ChangeOrderIssue {
  id            String      @id @default(cuid())
  changeOrderId String
  findingId     String
  issue         String
  evidence      String
  suggestedFix  String
  box2dJson     String?
  status        String      // "OPEN" | "RESOLVED" | "STILL_PRESENT" | "NEEDS_HUMAN_REVIEW"
}

model Approval {
  id              String   @id @default(cuid())
  packId          String
  packHash        String
  contractVersion Int
  reviewerName    String
  reviewerRole    String
  notes           String?
  isValid         Boolean  @default(true)
  approvedAt      DateTime @default(now())
}

model AuditLog {
  id         String   @id @default(cuid())
  campaignId String
  actorName  String
  actorRole  String
  action     String   // "CONTRACT_CREATED" | "INVITE_SENT" | "INVITE_ACCEPTED" | "PACK_SUBMITTED" | "CHANGE_ORDER_CREATED" | "APPROVED" | "INVALIDATED"
  detail     String
  createdAt  DateTime @default(now())
}
```

---

## 4. API Endpoints

| Method | Route | Purpose | Role Authorization |
|:---|:---|:---|:---|
| `GET` | `/api/campaigns` | List all campaigns with active status | All Roles |
| `POST` | `/api/campaigns` | Create a new campaign | Brand Manager |
| `POST` | `/api/campaigns/[id]/invites` | Generate secure role-scoped invite link | Brand Manager |
| `GET` | `/api/campaigns/[id]/invites` | View pending and accepted campaign invites | Brand Manager |
| `POST` | `/api/invites/[token]/accept` | Accept campaign invitation and join workspace (7-day token expiry check, 410 if revoked/expired) | Public / Invitee |
| `DELETE` | `/api/invites/[id]` | Revoke pending invitation | Brand Manager |
| `POST` | `/api/contracts` | Author or update campaign contract version | Brand Manager |
| `POST` | `/api/packs/check` | Submit asset pack and trigger 4-layer preflight | Creator |
| `POST` | `/api/packs/revision` | Submit revised creative (Rev 2) for Change Order | Creator |
| `POST` | `/api/packs/approve` | Execute SHA-256 cryptographic revision lock | Reviewer (Enforced server-side: rejects with `403 Forbidden` if caller role != `REVIEWER` OR if caller identity is enrolled as a non-Reviewer in the campaign membership roster) |
| `PATCH` | `/api/findings/[id]/resolve` | Accept or escalate individual finding | Creator / Reviewer |
| `GET` | `/api/analytics` | Fetch real-time cross-campaign governance metrics | Brand Manager |
| `POST` | `/api/demo/reset` | Reset demo campaign to pristine Rev 1 state for clean evaluations | All Roles / Evaluation (Isolated sandbox: strictly restricted to benchmark campaign `camp_ecosip_01`, returns 403 on non-benchmark IDs) |
