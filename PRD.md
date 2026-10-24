# PRD.md — CampaignGuard
> Project Requirements Document | Round 2 Hackathon Build

---

## 1. Problem Statement

Marketing teams publish campaigns across multiple assets (captions, banners, PDFs) created by different people. Contradictions slip through unnoticed:
- Caption says **20% off**, banner says **30% off**
- Product sheet says **"up to 12 hours cold"**, ad promises **"24 hours guaranteed"**
- Missing required disclaimers, outdated logos, prohibited language

Manual review = scattered Slack messages. No audit trail. No version control. Damage happens after publication.

---

## 2. Solution

**CampaignGuard** — an automated pre-publication preflight checker for marketing campaigns.

A Brand Manager defines a **Campaign Contract** (the single source of truth for one campaign). A Creator submits their assets. The system runs automated multi-layer checks and returns structured findings. A Reviewer approves the exact locked revision. Any edit afterward invalidates the approval.

---

## 3. Target Users

| Role | Who | What They Need |
|------|-----|----------------|
| Brand Manager | Marketing lead / agency director | Define campaign rules once; ensure variants are intentional |
| Creator | Copywriter / designer | Fast, specific, fixable feedback before submitting |
| Reviewer | Senior approver | Approve the exact final version with evidence, not memory |

> For the MVP demo: one demo account per role, selectable from the landing page. No real authentication complexity.

---

## 4. Core Concepts

### Campaign Contract
A structured, human-approved brief containing:
- Campaign name, product, market, channel, audience
- Offer percentage, eligibility clause, end date
- Approved product claims (e.g. "Keeps drinks cold for up to 12 hours")
- Required qualifiers (e.g. "On selected bottles")
- Prohibited terms (e.g. "miracle", "guaranteed", "world's best")
- Channel-specific variants (e.g. VIP email = 30%, Instagram = 20%)

### Campaign Pack
Assets submitted by the Creator for preflight check:
- Caption text (plain text input)
- Banner image (PNG/JPEG upload)
- Optional PDF document (text-based)

### Preflight Check (4 Layers)
1. **Campaign Facts** — Discount %, dates, eligibility match contract (deterministic)
2. **Cross-Asset Consistency** — Caption vs. image vs. PDF agree with each other
3. **Brand Rules** — Prohibited terms, required qualifiers, tone
4. **Accessibility** — Basic contrast flag, alt-text presence

### Finding
Each detected issue returns:
- location — which asset (caption / banner / PDF)
- issue — what is wrong
- evidence — contract clause violated + extracted text
- suggested_fix — minimal correction
- status — CONTRADICTED | INSUFFICIENT_EVIDENCE | SUPPORTED

### Approval & Invalidation
- Approval is bound to a specific revision hash + contract version
- Editing any asset after approval resets status to INVALIDATED and triggers re-review
- Every approval writes a permanent audit record

---

## 5. Features

### Must Ship (Core Workflow)
- Landing page with role-select demo login
- Campaign Contract creation form (Brand Manager)
- Campaign Pack submission: image + caption + PDF upload (Creator)
- AI-powered preflight check engine (4 layers)
- Structured findings report with accept / escalate actions
- Reviewer approval with revision lock
- Approval invalidation on edit
- Audit trail per campaign

### Should Ship (Polish)
- Dashboard with all campaigns and status badges
- Campaign Contract versioning display
- Revision history per campaign pack
- Repeated-issue summary (simple governance insight)
- Responsive design

### Explicitly Deferred
- Real multi-org authentication
- Video/audio asset checks
- Real file storage
- Automatic image redesign
- Legal compliance certification
- Enterprise integrations

---

## 6. Round 3 Improvements
1. **Brand Profile Library** — Reusable brand rules across campaigns
2. **Slack / Notion Integration** — Push findings into team workflows
3. **Governance Analytics Dashboard** — Track rule violations over time

---

## 7. Success Criteria for Judges
- Judge opens deployed link with no guidance needed
- Can create a Campaign Contract as Brand Manager
- Can submit a campaign pack as Creator and see findings
- Can approve as Reviewer
- Can edit an asset and see approval invalidated
- No broken pages or crashing errors
