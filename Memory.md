# Memory.md — CampaignGuard

> Living state tracker for CampaignGuard MVP build. Updated continuously across development phases.

---

## 1. Project Overview
- **Name:** CampaignGuard
- **Tagline:** Automated pre-publication preflight checker for marketing campaigns
- **Status:** Complete Functional MVP (Production Build Tested & Passed)
- **Deployment:** Vercel via Git
- **Design System:** Editorial / Literary Journal (Warm Parchment `#fefffc`, Paper `#ffffff`, Linen `#f9faf7`, Ink `#171717`, Mist `#dee2de` hairline borders, Twilight `#282834`, Signal Blue `#41a1cf`, Fraunces/Newsreader serif + Inter sans)

---

## 2. Key Architecture & Tech Decisions
- **Framework:** Next.js 14.2 (App Router, TypeScript)
- **Styling:** Tailwind CSS with custom editorial design tokens matching `Design.md`
- **Database:** Prisma ORM with SQLite for zero-friction local execution + ready for Neon PostgreSQL on Vercel
- **Deterministic Facts Engine:** Regex/number parsing for discounts, dates, prohibited superlatives, and required qualifiers
- **Multimodal AI Engine:** Google Gemini 1.5 Flash multimodal API for cross-asset reasoning, banner OCR verification, and tone inspection
- **Cryptographic Revision Lock:** SHA-256 hash payload binding; editing any asset after sign-off resets state to `INVALIDATED`
- **Auth:** Interactive Role Switcher in the frosted navigation pill (Brand Manager: Priya Sharma, Creator: Alex Chen, Reviewer: Marcus Vance)

---

## 3. Implemented Routes & Endpoints
- `/` — Editorial Landing Page with persona selector & architecture overview
- `/dashboard` — Interactive Preflight Review Workspace (Findings, Creator Pack Uploader, Campaign Contract Truth, Reviewer Lock, Audit Trail)
- `/demo-guide` — Judge Demonstration Blueprint (5-minute walkthrough sequence & required Round 2 disclosures)
- `/api/campaigns` — GET / POST campaigns with pre-seeded EcoSip scenario
- `/api/contracts` — Versioned Campaign Contract publisher
- `/api/packs/check` — 4-layer Preflight Inspection runner
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
- [x] Phase 8: Complete Production Build Verification (`next build` compiled cleanly with 11 static/dynamic routes)