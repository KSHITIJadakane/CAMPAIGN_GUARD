# CampaignGuard — Automated Pre-Publication Campaign Governance Platform
> **Round 3 Finalist Submission • Top 50 Edition (Selected from 1,500+ Teams)**  
> Built for the National Hackathon Grand Finale • October 2026

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini 1.5 Flash](https://img.shields.io/badge/Gemini_1.5_Flash-Multimodal_Vision-orange?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![SHA-256 Lock](https://img.shields.io/badge/Security-SHA--256_Cryptographic_Seal-green?style=flat)](https://en.wikipedia.org/wiki/SHA-2)

---

## 📌 Submission Overview & Quick Links

- **Live Deployed Application:** [https://cg.kshitijpro.xyz](https://cg.kshitijpro.xyz) *(Primary production deployment)*
- **Interactive Evaluation Blueprint:** [https://cg.kshitijpro.xyz/demo-guide](https://cg.kshitijpro.xyz/demo-guide) *(5-minute standalone judge walkthrough)*
- **Source Code Repository:** [GitHub Repository (KSHITIJadakane/CAMPAIGN_GUARD)](https://github.com/KSHITIJadakane/CAMPAIGN_GUARD)
- **Official Finalist PDF Dossier:** [`CampaignGuard_Round3_Submission.pdf`](./CampaignGuard_Round3_Submission.pdf) *(or downloadable directly from `/CampaignGuard_Round3_Submission.pdf`)*

---

## 🎯 The Core Problem & Value Proposition

In modern digital marketing, a single promotional campaign spans Instagram captions, display banners, PDF specifications, and email newsletters. Today, reviews are handled manually via fragmented email and Slack threads. Mismatched discounts (e.g. 30% on graphic vs. 20% in copy), prohibited health claims ("Miracle chill"), and missing legal qualifiers routinely trigger regulatory scrutiny, corrective reprint costs, and severe brand trust erosion.

**CampaignGuard solves this deterministically.** Brand Managers establish a canonical *Truth Contract*. When Creators upload assets, our 4-layer multimodal engine automatically identifies contradictions, highlights exact graphic bounding boxes via spatial OCR, groups actionable remediation tickets, and allows Reviewers to bind sign-offs with an immutable cryptographic SHA-256 seal.

---

## 🚀 The Three Delivered Round 3 Improvements

As committed at the conclusion of Round 2, all three production-grade engineering features have been delivered and verified:

### 1. Multi-Role Access Control (RBAC) & Secure Campaign Invitation Links
- **Scoped Role Workspaces:** Strict separation of duties between **Brand Lead** (`BRAND_MANAGER`), **Creator** (`CREATOR`), and **Reviewer Gatekeeper** (`REVIEWER`).
  - Creators can only upload assets and address change orders; Truth Contracts and Cryptographic Locks are read-only.
  - Reviewers can sign approvals and verify audit logs; contract rules are protected.
  - **Server-Side Enforcement:** `/api/packs/approve` strictly rejects non-Reviewer callers with HTTP `403 Forbidden`.
- **Tokenized Invite System:** Brand Managers generate cryptographically secure, 7-day tokenized invite links (`/invite?token=[token]`) for collaborating agency designers and legal gatekeepers. Tokens are protected by expiration and revocation guards.
- **Self-Service Onboarding:** The `/invite` acceptance portal validates token expiration, binds invited users to campaigns, and routes them directly to their role-specific workspace tab.
- **Revocation & Audit Logging:** Brand Leads can inspect active invites, copy URLs, and revoke pending tokens in real time.

### 2. Spatial Visual OCR & Evidence-Linked Creative Change Orders
- **Spatial Bounding-Box Detection:** Google Gemini 1.5 Flash multimodal vision extracts normalized 2D coordinates (`box_2d: [ymin, xmin, ymax, xmax]` scaled 0–1000) for visual discrepancies found in banner graphics.
- **Interactive SVG Graphic Overlay:** Bounding boxes are rendered dynamically over uploaded promotional banners. Clicking a box highlights the corresponding finding card and vice versa.
- **Structured Change Order Tickets:** Contradictions are grouped into formal Change Orders (`#co_ecosip_01`) with clear issue locations, contract evidence, and suggested remediations.
- **Revision v2 Re-Analysis & Resolution Diffing:** Creators submit revised copy and visual assets. The preflight engine automatically re-inspects the pack and marks resolved issues with green verification badges (`RESOLVED`).

### 3. Cross-Campaign Governance Analytics Intelligence Dashboard
- **Executive Intelligence Hub:** Accessible via the top navbar or `/dashboard?view=analytics`.
- **5 Live Real-Time KPIs:**
  1. *Campaigns Audited:* Active briefs with executed preflight scans.
  2. *Confirmed Violations:* Pre-publication contradictions caught across all active packs.
  3. *First-Pass Approval Rate (%):* Percentage of assets approved at Rev 1 without revisions.
  4. *Average Revision Rounds:* Mean correction cycles required to reach sign-off.
  5. *Cryptographically Sealed Vault:* Approved SHA-256 version-locked packs.
- **Categorical Violation Distribution:** Visual percentage breakdown across Facts, Cross-Asset Specs, Brand Rules, and Accessibility.
- **Campaign Compliance Comparison Matrix:** Real-time table tracking revision count, contract versions, open issues, and approval statuses across all brands.
- **Workflow Bottleneck Tracker:** Live operational queue monitor tracking hours waiting on Creator revision vs Reviewer sign-offs (distinct from the 5 governance KPIs).

---

## 🛠️ Complete System Architecture

```
                          ┌─────────────────────────────┐
                          │   Canonical Truth Contract  │
                          │ (Discounts, Dates, Rules)   │
                          └──────────────┬──────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
    ┌───────────────────────────┐                 ┌───────────────────────────┐
    │  Creative Studio Upload   │                 │   Gemini 1.5 Flash Vision │
    │ (Caption, Banner, PDF)    │                 │ (OCR & Spatial Coordinates)│
    └────────────┬──────────────┘                 └──────────────┬────────────┘
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                          ┌─────────────────────────────┐
                          │   4-Layer Preflight Scan    │
                          │ 1. Facts & Mathematical Discrepancies
                          │ 2. Cross-Asset Spec Conflicts
                          │ 3. Brand Rules & Superlatives
                          │ 4. Visual Contrast & Accessibility
                          └──────────────┬──────────────┘
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │    Evidence-Linked Change Order Tickets       │
                 │   + Interactive SVG Graphic Bounding Boxes   │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                          ┌─────────────────────────────┐
                          │   Gatekeeper Cryptographic  │
                          │   Version-Lock (SHA-256)    │
                          └──────────────┬──────────────┘
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │  Adversarial Tamper Invalidation Protocol     │
                 │  Any unauthorized edit post-seal revokes lock│
                 └───────────────────────────────────────────────┘
```

### The 4-Layer Inspection Pipeline
1. **Layer 1: Facts & Arithmetic Verification:** Compares numeric discounts, prices, and expiration dates between the contract and copy.
2. **Layer 2: Cross-Asset Specification Alignment:** Evaluates physical dimensions, technical specifications, and cold/heat retention claims across captions, image OCR, and PDF datasheets.
3. **Layer 3: Brand Rules & Prohibited Terminology:** Deterministically flags forbidden superlatives ("Miracle", "guaranteed") and mandates qualified disclaimer footnotes.
4. **Layer 4: Accessibility & Visual Clarity:** Inspects visual contrast ratios, legible typography sizing, and mandatory alt-text descriptions.

### Cryptographic Revision Lock & Adversarial Invalidation
```ts
packHash = SHA256(caption + bannerBase64 + pdfText + contractVersion)
```
When an Authorised Reviewer signs off, the asset pack is frozen with this SHA-256 seal. If an external editor or agency modifies even one word or pixel post-approval, the checksum mismatch triggers an instant status rollback to `INVALIDATED`.

---

## 🧪 Comprehensive Verification & Test Suite

CampaignGuard includes an automated regression test suite verifying all API endpoints, server-side RBAC guards, and edge cases:

```bash
# 1. Type-check strictly (0 errors)
npx tsc --noEmit

# 2. Production build verification (15/15 static & dynamic routes compiled)
npm run build

# 3. Automated End-to-End API Test Suite
node scratch/test_round3_apis.js
```

### Automated Test Matrix Results
| Test Category | Target Scope | Status |
|:---|:---|:---:|
| **TypeScript Compilation** | Strict type assertions across all components and API routes | ✅ `0 errors` |
| **Next.js Production Build** | Standalone production bundle (`next build`) | ✅ `15/15 routes` |
| **Campaign Directory API** | `GET /api/campaigns` returns members, invites, and change orders | ✅ `Passed` |
| **Governance Analytics API** | `GET /api/analytics` aggregates 5 KPIs, categories, and bottlenecks | ✅ `Passed` |
| **Team Invites API** | `POST /api/campaigns/[id]/invites` creates tokens with 7d expiration | ✅ `Passed` |
| **Invite Acceptance API** | `POST /api/invites/[token]/accept` validates tokens and binds members | ✅ `Passed` |
| **Creator Revision Flow** | `POST /api/packs/revision` executes re-analysis and marks 4/4 resolved | ✅ `Passed` |
| **Server-Side RBAC Enforcement** | `POST /api/packs/approve` rejects unauthorized callers with `403 Forbidden` | ✅ `Passed` |
| **Tamper Invalidation** | Out-of-band edits automatically revoke SHA-256 approval lock | ✅ `Passed` |
| **Demo State Reset** | `POST /api/demo/reset` restores pristine benchmark state for fresh runs | ✅ `Passed` |

---

## 💾 Dual-Tier Persistence Architecture

To guarantee zero setup friction and seamless evaluation for judges:
- **Tier 1 — High-Fidelity In-Memory Benchmark Store:** Pre-seeded with 4 benchmark campaigns (`camp_ecosip_01`, `camp_solarglow_02`, `camp_zenith_03`, `camp_aurora_04`), live Change Orders, and audit trails. Allows instant interactive demonstration with zero database migration steps and zero cold-start latency.
- **Tier 2 — Relational Schema (Prisma ORM):** Complete, typed SQLite / PostgreSQL schema (`prisma/schema.prisma`) modeling multi-tenant campaigns, role members, contracts, asset packs, and tamper-evident audit logs for durable enterprise deployments.

---

## 💻 Local Setup & Execution Guide

Follow these steps to run CampaignGuard locally from source:

### Prerequisites
- Node.js 18.17+ or Node.js 20+ (Node 24 tested)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/KSHITIJadakane/CAMPAIGN_GUARD.git
cd CAMPAIGN_GUARD
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory (or use `.env.example`):
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-google-gemini-api-key"
GEMINI_MODEL="gemini-1.5-flash"
```
*(Note: If `GEMINI_API_KEY` is omitted, the system operates deterministically using its rule-based verification fallback engine, ensuring high evaluation reliability even offline).*

### 3. Initialize Database & Build
```bash
npx prisma generate
npm run build
```

### 4. Start the Application
```bash
# Production server
npm start

# Or development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🗺️ Product Roadmap (Post-Hackathon Enterprise Phases)

- **Phase 13 (Q1 2027) — Enterprise SSO & Notification Bridges:** Okta/SAML 2.0 corporate directory sync + interactive Slack & Microsoft Teams webhook approvals.
- **Phase 14 (Q2 2027) — Multi-Channel Publishing Bridges:** Direct publishing connectors for Shopify, Meta Ads Manager, and Google Ads API with cryptographic lock gating (blocks campaign launch if SHA seal is revoked).
- **Phase 15 (Q3 2027) — Sovereign On-Premise LLMs:** Air-gapped fine-tuned open-weights models for highly regulated banking, healthcare, and pharmaceutical brand compliance.

---

## 👥 Hackathon Team Sign-Off

- **Project:** CampaignGuard
- **Event:** Hackathon Round 3 — Grand Finale (Top 50 Finalist)
- **Submission Date:** October 30, 2026
- **Status:** Complete Production Release
