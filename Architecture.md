# Architecture.md — CampaignGuard
> App Architecture, Folder Structure & Tech Stack

---

## 1. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 (App Router) + TypeScript | Full-stack in one repo, native Vercel deployment, server components |
| Styling | Tailwind CSS + shadcn/ui | Premium components, dark mode, consistent design system |
| Database | Neon (serverless PostgreSQL) + Prisma ORM | Free tier, works natively on Vercel serverless |
| AI | Google Gemini 1.5 Pro (multimodal) | Reads images directly — no separate OCR library needed |
| Auth | NextAuth.js v5 (credentials provider) | Demo login per role, zero friction |
| File Handling | Base64 in DB for demo | No external storage needed for hackathon |
| Deployment | Vercel (Git auto-deploy) | Native Next.js host |

---

## 2. App Flow

```
[Landing Page] — Role select (Brand Manager / Creator / Reviewer)
        |
        v
[Dashboard] — List of campaigns with status
        |
        +——> [Contract Builder] (Brand Manager)
        |         Create / edit Campaign Contract
        |         Set facts, claims, prohibited terms, variants
        |
        +——> [Submit Pack] (Creator)
        |         Upload caption + banner + PDF
        |         Trigger preflight check
        |         View findings report
        |         Accept / escalate findings
        |
        +——> [Review & Approve] (Reviewer)
                  See findings summary + evidence
                  Approve (locks revision hash)
                  Any edit after = INVALIDATED
```

---

## 3. AI Check Pipeline

```
Campaign Pack submitted
        |
        +——> DETERMINISTIC (TypeScript, no AI)
        |       - Discount % regex match vs contract number
        |       - Date compare vs contract end date
        |       - Prohibited terms: string.includes()
        |       - Required qualifiers: string.includes()
        |
        +——> GEMINI 1.5 PRO (multimodal, structured JSON output)
                - Send: caption + base64 image + PDF text + contract JSON
                - Returns: structured Finding[] array
                - Validated with Zod schema before saving
                - Tasks: image text extraction, cross-asset compare, tone check
```

---

## 4. Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     // BRAND_MANAGER | CREATOR | REVIEWER
  campaigns Campaign[]
}

model Campaign {
  id          String           @id @default(cuid())
  name        String
  status      CampaignStatus   // DRAFT | NEEDS_REVIEW | APPROVED | INVALIDATED
  createdAt   DateTime         @default(now())
  contracts   Contract[]
  packs       CampaignPack[]
  auditLogs   AuditLog[]
}

model Contract {
  id              String    @id @default(cuid())
  version         Int       @default(1)
  campaignId      String
  campaign        Campaign  @relation(...)
  product         String
  channel         String
  audience        String
  offerPercent    Float
  eligibility     String
  endDate         DateTime
  approvedClaims  String[]
  requiredQuals   String[]
  prohibitedTerms String[]
  variants        Json      // channel-specific variant overrides
  createdAt       DateTime  @default(now())
  isActive        Boolean   @default(true)
}

model CampaignPack {
  id           String    @id @default(cuid())
  revision     Int       @default(1)
  hash         String    // SHA256 of all asset content
  campaignId   String
  caption      String
  bannerBase64 String?
  pdfText      String?
  status       PackStatus // PENDING | CHECKING | FINDINGS | APPROVED | INVALIDATED
  findings     Finding[]
  approvals    Approval[]
  createdAt    DateTime  @default(now())
}

model Finding {
  id           String       @id @default(cuid())
  packId       String
  layer        CheckLayer   // FACTS | CROSS_ASSET | BRAND_RULES | ACCESSIBILITY
  location     String       // "caption" | "banner" | "pdf"
  issue        String
  evidence     String
  suggestedFix String
  status       FindingStatus // CONTRADICTED | INSUFFICIENT_EVIDENCE | SUPPORTED
  resolution   Resolution?  // ACCEPTED | ESCALATED | PENDING
}

model Approval {
  id              String   @id @default(cuid())
  packId          String
  packHash        String   // bound to this exact revision
  contractVersion Int      // bound to this contract version
  reviewerId      String
  approvedAt      DateTime @default(now())
  notes           String?
}

model AuditLog {
  id         String   @id @default(cuid())
  campaignId String
  userId     String
  action     String
  detail     String
  createdAt  DateTime @default(now())
}
```

---

## 5. Folder Structure

```
campaign-guard/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout, fonts, theme
│   │   ├── page.tsx                      # Landing page
│   │   ├── (auth)/
│   │   │   └── login/page.tsx            # Role select login
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # Campaign list + status
│   │   ├── contracts/
│   │   │   ├── new/page.tsx              # Create contract (Brand Manager)
│   │   │   └── [id]/page.tsx             # View/edit contract
│   │   ├── campaigns/
│   │   │   ├── [id]/
│   │   │   │   ├── submit/page.tsx       # Upload pack (Creator)
│   │   │   │   ├── report/page.tsx       # Findings report
│   │   │   │   ├── approve/page.tsx      # Reviewer approval
│   │   │   │   └── history/page.tsx      # Audit trail
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── campaigns/route.ts
│   │       ├── contracts/route.ts
│   │       ├── packs/route.ts
│   │       ├── packs/[id]/check/route.ts # Trigger preflight
│   │       ├── packs/[id]/approve/route.ts
│   │       └── findings/[id]/resolve/route.ts
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── contract/
│   │   │   └── ContractForm.tsx
│   │   ├── campaign/
│   │   │   ├── CampaignCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── PackUploader.tsx
│   │   ├── findings/
│   │   │   ├── FindingCard.tsx
│   │   │   ├── FindingsReport.tsx
│   │   │   └── LayerStatus.tsx
│   │   └── approval/
│   │       └── ApprovalPanel.tsx
│   ├── lib/
│   │   ├── prisma.ts                     # Prisma client singleton
│   │   ├── auth.ts                       # NextAuth config
│   │   ├── gemini.ts                     # Gemini API client
│   │   ├── preflight/
│   │   │   ├── index.ts                  # Orchestrator
│   │   │   ├── deterministic.ts          # Fact checks (no AI)
│   │   │   └── gemini-check.ts           # AI layer
│   │   ├── hash.ts                       # SHA256 revision hash
│   │   └── validators.ts                 # Zod schemas
│   └── types/
│       └── index.ts                      # Shared TypeScript types
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 6. API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET/POST | /api/campaigns | List / create campaigns |
| GET/POST | /api/contracts | List / create contracts |
| POST | /api/packs | Submit a new campaign pack |
| POST | /api/packs/[id]/check | Trigger preflight check |
| POST | /api/packs/[id]/approve | Reviewer approves revision |
| PATCH | /api/findings/[id]/resolve | Accept or escalate a finding |

---

## 7. Environment Variables

```env
DATABASE_URL=           # Neon PostgreSQL connection string
GEMINI_API_KEY=         # Google Gemini API key
NEXTAUTH_SECRET=        # Random secret for NextAuth
NEXTAUTH_URL=           # Deployment URL
```
