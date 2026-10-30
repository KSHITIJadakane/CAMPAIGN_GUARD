# Memory.md — CampaignGuard

> Living state tracker for CampaignGuard MVP build. Updated continuously across development phases.

---

## 1. Project Overview
- **Name:** CampaignGuard
- **Tagline:** Automated pre-publication preflight checker for marketing campaigns
- **Status:** Round 3 Finalist Enterprise Build (Top 50 Edition)
- **Deployment:** Vercel via Git
- **Design System:** Editorial / Literary Journal (Warm Parchment `#fefffc`, Paper `#ffffff`, Linen `#f9faf7`, Ink `#171717`, Mist `#dee2de` hairline borders, Twilight `#282834`, Signal Blue `#41a1cf`, Fraunces/Newsreader serif + Inter sans)

---

## 2. Key Architecture & Tech Decisions
- **Framework:** Next.js 14.2 (App Router, TypeScript)
- **Styling:** Tailwind CSS with custom editorial design tokens matching `Design.md`
- **Database:** Prisma ORM with SQLite for zero-friction local execution + high-reliability memory store with unified enterprise state for Vercel serverless
- **Deterministic Facts Engine:** Regex/number parsing for discounts, dates, prohibited superlatives, and required qualifiers
- **Multimodal AI Engine:** Google Gemini 1.5 Flash multimodal API with spatial OCR bounding box (`box_2d: [ymin, xmin, ymax, xmax]`) extraction
- **Cryptographic Revision Lock:** SHA-256 hash payload binding; editing any asset after sign-off resets state to `INVALIDATED`
- **Role Scoping & Invites (R3 Feature 1):** Scoped workspaces (`BRAND_MANAGER`, `CREATOR`, `REVIEWER`) + tokenized invite links (`/invite?token=...`) with email, role, and expiry enforcement
- **Visual OCR & Change Orders (R3 Feature 2):** Spatial SVG bounding box overlays on graphics + actionable Change Order tickets + Creator Revision v2 re-analysis & resolution diffing
- **Governance Analytics Dashboard (R3 Feature 3):** Live enterprise intelligence dashboard aggregating 5 KPIs, violation category distribution, campaign compliance comparisons, and workflow bottlenecks

---

## 3. Implemented Routes & Endpoints
- `/` — Editorial Landing Page with interactive preflight scanner and persona selector
- `/dashboard` — Interactive Preflight Review Workspace (Findings, Creator Pack Uploader, Campaign Contract Truth, Reviewer Lock, Audit Trail, Team Invites Modal)
- `/dashboard?view=analytics` — Enterprise Governance Analytics Dashboard (5 KPIs, Category Breakdown, Campaign Compliance Comparison, Bottlenecks)
- `/invite` — Tokenized Campaign Invitation Acceptance Portal
- `/demo-guide` — Judge Demonstration Blueprint (5-minute walkthrough sequence & Round 3 finalist disclosures)
- `/api/campaigns` — GET / POST campaigns with pre-seeded EcoSip scenario, members, invites, and change orders
- `/api/campaigns/[id]/invites` — GET / POST campaign invitations
- `/api/campaigns/[id]/invites/[inviteId]` — DELETE revoke campaign invitations
- `/api/invites/[token]/accept` — GET / POST accept invitation token
- `/api/analytics` — GET aggregated cross-campaign governance metrics
- `/api/packs/revision` — POST creator revision v2 with re-analysis & change order resolution diffing
- `/api/contracts` — Versioned Campaign Contract publisher
- `/api/packs/check` — 4-layer Preflight Inspection runner with Gemini spatial OCR bounding boxes
- `/api/packs/approve` — Reviewer Cryptographic Approval & Version-Lock
- `/api/findings/resolve` — Accept suggested corrections / Escalate issues

---

## 4. Phase Status
- [x] Phase 0: Foundations & Documentation (PRD, Architecture, Rules, Phases, Design, Memory)
- [x] Phase 1: Project Scaffold (Next.js + Tailwind + Prisma + Design Tokens)
- [x] Phase 2: Database Schema & Seed Data (EcoSip Weekend Flash Sale with pre-loaded contradictions)
- [x] Phase 3: Brand Manager Workflow (Contract Builder, versioning v1 -> v2)
- [x] Phase 4: Creator Workflow (Asset Pack Uploader: Caption, Banner image, PDF spec sheet)
- [x] Phase 5: Preflight Inspection Engine (4 Layers: Facts, Cross-Asset, Brand Rules, Accessibility)
- [x] Phase 6: Findings Report & Interactive Resolution UI (Accept fix / Escalate)
- [x] Phase 7: Reviewer Workflow & Cryptographic Revision Lock (Approval & Automatic Invalidation on edit)
- [x] Phase 8: Baseline Production Build Verification
- [x] Phase 9: Multi-Role Access Control & Invite Link Flow (R3 Feature 1)
- [x] Phase 10: Visual OCR & Evidence-Linked Change Orders (R3 Feature 2)
- [x] Phase 11: Cross-Campaign Governance Analytics Dashboard (R3 Feature 3)
- [ ] Phase 12: End-to-End Verification, Final PDF Submission, & Release Packaging