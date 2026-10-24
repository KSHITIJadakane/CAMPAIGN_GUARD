# Phases.md — CampaignGuard
> Build Phases (Hackathon MVP) — Execution Checklist

---

## Phase 0 — Project Setup
**Goal:** Scaffold the project, configure all tools, deploy a blank app to Vercel.

- [x] Init Next.js 14 + TypeScript project
- [x] Install and configure Tailwind CSS with custom editorial tokens from Design.md
- [x] Set up Prisma ORM with SQLite + serverless persistence
- [x] Configure demo personas with instant role switching (Brand Manager, Creator, Reviewer)
- [x] Set up environment variables locally and on Vercel (.env, .env.local, .env.example)
- [x] Push to GitHub, connect to Vercel, verify auto-deploy works (HTTP 200)
- [x] Create base layout: Frosted navigation pill, warm parchment canvas, footer

---

## Phase 1 — Database & Auth
**Goal:** All DB models exist, demo personas work per role.

- [x] Write full Prisma schema (User, Campaign, Contract, CampaignPack, Finding, Approval, AuditLog)
- [x] Push database schema to SQLite (dev.db) & configure high-reliability memory store
- [x] Seed demo data: 3 users (Priya Sharma, Alex Chen, Marcus Vance) & EcoSip campaign
- [x] Implement instant role switcher in navigation header
- [x] Landing page with role selector cards and direct console launching
- [x] Session-aware status badges and dynamic user profile display

---

## Phase 2 — Campaign Contract Builder
**Goal:** Brand Manager can create a Campaign Contract.

- [x] Dashboard page: list campaigns, status badges, "New Campaign" modal
- [x] Campaign creation modal (name, product, brand)
- [x] Contract Builder form:
  - [x] Campaign details (product, channel, audience, market)
  - [x] Offer fields (percent, eligibility, end date)
  - [x] Approved claims (multi-entry with tag chips)
  - [x] Required qualifiers (multi-entry)
  - [x] Prohibited terms (tag input)
  - [x] Channel variants (add variant: channel + override percent)
- [x] Save contract via POST /api/contracts
- [x] Contract versioning: edit creates v2, not overwrite
- [x] Prior approval automatically invalidated when contract changes

---

## Phase 3 — Campaign Pack Submission
**Goal:** Creator can upload assets and trigger preflight check.

- [x] Creator submission pack tab
- [x] Social copy / caption text input with character counter
- [x] Banner image upload (drag-and-drop, base64 encode with live preview)
- [x] Technical PDF spec document extract editor
- [x] Compute SHA-256 hash of combined asset content (cryptographic revision lock prep)
- [x] Save CampaignPack via POST /api/packs/check
- [x] "Run Preflight Inspection" button with animated multi-stage progress indicator

---

## Phase 4 — Preflight Check Engine
**Goal:** The core AI + deterministic check pipeline works and returns findings.

### Deterministic checks (TypeScript):
- [x] Extract numbers from caption/PDF and compare to contract offerPercent
- [x] Check end date mentioned in assets vs contract endDate
- [x] Scan for prohibited terms across all asset text
- [x] Verify required qualifiers are present in all asset text

### Gemini checks (Multimodal AI):
- [x] Build structured prompt with contract JSON + caption + base64 image + PDF text
- [x] Request structured JSON output: Finding[]
- [x] Connected to live Google Gemini 3.8 Flash model
- [x] Merge deterministic + AI findings into unified list
- [x] Save all findings with layer, location, evidence, status

### Failure handling:
- [x] Anti-prompt injection wrapping using untrusted data delimiters
- [x] Graceful fallback to deterministic engine if API key is absent

---

## Phase 5 — Findings Report
**Goal:** Creators and Reviewers can see exactly what is wrong.

- [x] Preflight Inspection Findings tab
- [x] 4-layer status summary header (Facts / Cross-Asset / Brand Rules / Accessibility)
  - [x] Color-coded pass / warning / error indicators per layer
- [x] Finding cards showing: location, issue, ground truth evidence, suggested fix, status badge
- [x] Accept Suggested Fix / Escalate buttons per finding
- [x] PATCH /api/findings/resolve endpoint updating audit trail in real-time
- [x] Overall campaign status header (NEEDS_REVIEW / READY_FOR_APPROVAL)

---

## Phase 6 — Approval & Invalidation
**Goal:** Reviewer can approve a locked revision; edit invalidates it.

- [x] Authorised Review & Lock tab
  - [x] Displays revision payload hash bound to active contract version
  - [x] Unresolved contradictions warning with exception justification notes
  - [x] Approve button executing cryptographic lock
- [x] POST /api/packs/approve
  - [x] Sets campaign status to APPROVED & LOCKED
  - [x] Logs permanent audit record
- [x] Automatic Invalidation Logic:
  - [x] Modifying caption or banner recalculates SHA-256 hash
  - [x] If hash differs from approved hash, resets status to INVALIDATED
  - [x] Prominent red warning banner alerts team of unauthorized asset drift

---

## Phase 7 — Audit Trail & Dashboard Polish
**Goal:** Full audit trail, polished dashboard, ready for judge demo.

- [x] Audit log writes on every action (contract create, pack submit, check run, finding resolved, approval, invalidation)
- [x] Audit Trail tab with timeline view and actor role badges
- [x] Multi-campaign selector pills
- [x] Pre-seeded realistic demo data: EcoSip campaign with 4 flagged contradictions
- [x] Full judge walkthrough guide at /demo-guide

---

## Phase 8 — Final Polish & Deploy
**Goal:** Ship it. Zero broken pages. Judges can self-navigate.

- [x] Responsive layout check (mobile/tablet/desktop)
- [x] Verified with `npm run build` (11 routes compiled cleanly)
- [x] Pushed to GitHub: https://github.com/KSHITIJadakane/CAMPAIGN_GUARD.git
- [x] Live Vercel deployment verified: https://campaignguard-five.vercel.app/ (HTTP 200 OK)
- [x] Security audit: Zero exposed keys, no client-side leaks, clean git history