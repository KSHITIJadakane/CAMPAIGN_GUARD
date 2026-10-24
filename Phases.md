# Phases.md — CampaignGuard
> Build Phases (Hackathon MVP)

---

## Phase 0 — Project Setup
**Goal:** Scaffold the project, configure all tools, deploy a blank app to Vercel.

- [ ] Init Next.js 14 + TypeScript project
- [ ] Install and configure Tailwind CSS
- [ ] Install and init shadcn/ui
- [ ] Set up Prisma with Neon PostgreSQL
- [ ] Configure NextAuth.js with 3 demo users (one per role)
- [ ] Set up environment variables locally and on Vercel
- [ ] Push to GitHub, connect to Vercel, verify auto-deploy works
- [ ] Create base layout: Navbar, Sidebar, dark theme

---

## Phase 1 — Database & Auth
**Goal:** All DB models exist, demo login works per role.

- [ ] Write full Prisma schema (User, Campaign, Contract, CampaignPack, Finding, Approval, AuditLog)
- [ ] Run `prisma migrate dev` against Neon
- [ ] Seed demo data: 3 users (1 per role), 1 sample campaign with contract
- [ ] Implement NextAuth credentials login
- [ ] Landing page with "Login as Brand Manager / Creator / Reviewer" buttons
- [ ] Session-aware Navbar showing role badge
- [ ] Protect routes by role using middleware

---

## Phase 2 — Campaign Contract Builder
**Goal:** Brand Manager can create a Campaign Contract.

- [ ] Dashboard page: list campaigns, status badges, "New Campaign" button
- [ ] Campaign creation modal (name, product, description)
- [ ] Contract Builder form:
  - Campaign details (product, channel, audience, market)
  - Offer fields (percent, eligibility, end date)
  - Approved claims (multi-entry)
  - Required qualifiers (multi-entry)
  - Prohibited terms (tag input)
  - Channel variants (add variant: channel + override percent)
- [ ] Save contract via POST /api/contracts
- [ ] Contract versioning: edit creates v2, not overwrite
- [ ] View contract detail page

---

## Phase 3 — Campaign Pack Submission
**Goal:** Creator can upload assets and trigger preflight check.

- [ ] Campaign submit page (Creator role)
- [ ] Caption text input
- [ ] Banner image upload (drag-drop, base64 encode)
- [ ] PDF upload (extract text client-side or send to API)
- [ ] Compute SHA256 hash of combined asset content (revision lock prep)
- [ ] Save CampaignPack via POST /api/packs
- [ ] "Run Preflight Check" button → POST /api/packs/[id]/check
- [ ] Loading state with animated progress steps while checking

---

## Phase 4 — Preflight Check Engine
**Goal:** The core AI + deterministic check pipeline works and returns findings.

### Deterministic checks (TypeScript):
- [ ] Extract numbers from caption/PDF and compare to contract offerPercent
- [ ] Check end date mentioned in assets vs contract endDate
- [ ] Scan for prohibited terms across all asset text
- [ ] Verify required qualifiers are present in all asset text

### Gemini checks (AI):
- [ ] Build structured prompt with contract JSON + caption + base64 image + PDF text
- [ ] Request structured JSON output: Finding[]
- [ ] Validate response with Zod schema
- [ ] Merge deterministic + AI findings into unified list
- [ ] Save all findings to DB with layer, location, evidence, status

### Failure handling:
- [ ] Gemini timeout/error → mark semantic findings INCOMPLETE, don't block
- [ ] Unreadable image → OCR_FAILED finding, flag for manual review

---

## Phase 5 — Findings Report
**Goal:** Creators and Reviewers can see exactly what is wrong.

- [ ] Findings report page at /campaigns/[id]/report
- [ ] Layer-by-layer status summary (Facts / Cross-Asset / Brand Rules / Accessibility)
  - Green (all pass) / Amber (warnings) / Red (errors) per layer
- [ ] Finding cards showing: location, issue, evidence, suggested fix, status badge
- [ ] Accept / Escalate buttons per finding
- [ ] PATCH /api/findings/[id]/resolve endpoint
- [ ] Overall campaign status header (NEEDS_REVIEW / READY_FOR_APPROVAL)
- [ ] Re-run check button

---

## Phase 6 — Approval & Invalidation
**Goal:** Reviewer can approve a locked revision; edit invalidates it.

- [ ] Reviewer approval page at /campaigns/[id]/approve
  - Shows: pack revision, contract version, findings summary, remaining issues
  - Approve button with notes field
- [ ] POST /api/packs/[id]/approve
  - Stores: packHash, contractVersion, reviewerId, timestamp
  - Sets campaign status to APPROVED
- [ ] Approval invalidation logic:
  - On any new pack submission or asset edit → compute new hash
  - If hash differs from approved hash → set status to INVALIDATED
  - Show red INVALIDATED banner on campaign

---

## Phase 7 — Audit Trail & Dashboard Polish
**Goal:** Full audit trail, polished dashboard, ready for judge demo.

- [ ] Audit log write on every action (contract create, pack submit, check run, finding resolved, approval, invalidation)
- [ ] Audit trail page at /campaigns/[id]/history
  - Timeline view: avatar + action + timestamp
- [ ] Dashboard improvements:
  - Campaign cards with status, last updated, role-relevant CTAs
  - Simple repeated-issue count (how many times each rule was broken)
- [ ] Seed realistic demo data: EcoSip campaign with contradictions pre-loaded
- [ ] Loading skeletons on all data-fetching pages
- [ ] Empty states for no campaigns / no findings

---

## Phase 8 — Final Polish & Deploy
**Goal:** Ship it. Zero broken pages. Judges can self-navigate.

- [ ] Responsive layout check (mobile/tablet)
- [ ] Error boundaries on all pages
- [ ] Run `next build` — fix all TypeScript/lint errors
- [ ] Push to GitHub → Vercel auto-deploys
- [ ] Smoke test full flow on deployed URL:
  1. Login as Brand Manager → create contract
  2. Login as Creator → submit pack → run check → view findings
  3. Login as Reviewer → approve
  4. Login as Creator → edit caption → confirm INVALIDATED
- [ ] Update submission PDF with completed features list
- [ ] Submit to Round 2 Google Form

---

## Phase Priority Order
```
0 (Setup) → 1 (Auth/DB) → 2 (Contract) → 3 (Submit) → 4 (Check Engine) → 5 (Report) → 6 (Approval) → 7 (Audit) → 8 (Deploy)
```
Do NOT skip phases. Each phase depends on the previous.
