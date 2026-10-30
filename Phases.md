# Phases.md — CampaignGuard
> Build Phases & Execution Checklist | Round 3 Finalist Enterprise Build

---

## Completed Baseline Phases (Round 1 & Round 2 Foundations)

- [x] **Phase 0 — Project Setup & Design System** (Next.js 14, Tailwind editorial tokens, Vercel CI/CD)
- [x] **Phase 1 — Relational Data Modeling & Persona Switcher** (Prisma models, in-memory edge store, demo benchmark)
- [x] **Phase 2 — Campaign Contract Builder** (Canonical brief, discount %, claims, prohibited terms, variants)
- [x] **Phase 3 — Creative Studio & Asset Ingestion** (Caption editor, banner uploader, PDF extraction, SHA-256 hash)
- [x] **Phase 4 — 4-Layer Preflight Engine** (Hybrid deterministic TypeScript + Gemini multimodal inspection)
- [x] **Phase 5 — Structured Findings Report** (Location, ground truth evidence, suggested fix, severity badges)
- [x] **Phase 6 — Approval & Cryptographic Revision Lock** (SHA-256 seal, post-approval edit auto-invalidation)
- [x] **Phase 7 — Audit Ledger & Campaigns Hub** (Append-only audit trail, multi-campaign cards, demo benchmark isolation)
- [x] **Phase 8 — Round 2 Hardening** (Responsive UI, modular step navigation, clean breadcrumbs)

---

## Round 3 Finalist Phases (The Three Committed Improvements)

### Phase 9 — Multi-Role Access Control & Invitation System (Feature 1)
**Goal:** Replace client-only persona switching with real campaign-scoped role permissions and shareable invite links.
- [x] Data models: `CampaignMember` and `CampaignInvite` schema with token expiration.
- [x] Brand Manager "Invite Collaborator" modal: specify email and role (`CREATOR` or `REVIEWER`).
- [x] Token generator creating unique shareable links: `/invite?token=inv_...`.
- [x] Dedicated `/invite` acceptance page displaying campaign brief overview and role acceptance CTA.
- [x] Server-enforced role permissions:
  - Creators cannot edit contracts or execute approval locks.
  - Reviewers cannot silently alter creative assets or bypass preflight findings.
  - Brand Managers retain full campaign and analytics oversight.
- [x] Retain Quick Judge Switcher for zero-setup evaluation.

---

### Phase 10 — Visual OCR & Evidence-Linked Change Orders (Feature 2)
**Goal:** Transition from text-only findings to interactive visual overlays and structured revision workflows.
- [x] Enhance Gemini prompt to output normalized spatial coordinates `box_2d: [ymin, xmin, ymax, xmax]` for image contradictions.
- [x] Coordinate validation and clamping (0–1000) with graceful fallback for unanchored findings (zero fabrication).
- [x] Build `AnnotatedCreativeViewer` with interactive SVG/HTML highlight overlays on banner images.
- [x] Bidirectional click synchronization between visual bounding boxes and finding cards.
- [x] Group findings into a formal **Change Order Ticket** bound to asset version.
- [x] Creator **Revision Upload (Rev 2)** interface with Designer Correction Notes.
- [x] Automated re-analysis comparing Rev 2 against Rev 1 issues (`RESOLVED` vs `STILL_PRESENT` vs `NEEDS_HUMAN_REVIEW`).
- [x] Reviewer before/after visual verification gate prior to cryptographic sealing.

---

### Phase 11 — Cross-Campaign Governance Analytics Dashboard (Feature 3)
**Goal:** Operational visibility across all campaigns, exposing systemic bottlenecks and compliance velocity.
- [x] Build authoritative aggregation service (`src/lib/store.ts` + `/api/analytics`) reading live campaign state.
- [x] Implement 5 real-time KPI metrics:
  - Total Campaigns Audited
  - Confirmed Violations Detected
  - First-Pass Approval Rate (%)
  - Average Revision Rounds (Cycles)
  - Cryptographically Sealed Vault
- [x] Dynamic interactive visual charts:
  - Violations by Category (Facts vs Brand Rules vs Cross-Asset vs Accessibility)
  - Campaign Compliance Comparison Matrix
  - Workflow Bottleneck Tracker (waiting on Creator revision vs Reviewer signoff)
- [x] Category and campaign filter controls with real-time recalculation.
- [x] Full empty-state and sample-size awareness.

---

### Phase 12 — Final Hardening, Verification & Documentation
**Goal:** Bulletproof reliability, zero-error production build, and comprehensive documentation.
- [x] Remove all obsolete Round 2 files, scripts, and navigation links.
- [x] Stress-test edge cases: empty uploads, malformed inputs, re-submissions, rapid persona switches.
- [x] Verify clean build with `npm run build` (15/15 routes compiled).
- [x] Update `README.md` with end-to-end setup instructions, architecture overview, and judge walkthrough.
- [x] Generate publication-grade Round 3 submission PDF (`CampaignGuard_Round3_Submission.pdf`).