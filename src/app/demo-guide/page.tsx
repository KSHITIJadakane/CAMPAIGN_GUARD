import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, ArrowRight, Layers, Sparkles, AlertTriangle } from "lucide-react";

export default function DemoGuidePage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto py-4">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[13px] font-mono text-ash hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Live Console
        </Link>
      </div>

      {/* Guide Header */}
      <div className="space-y-3 border-b border-mist pb-6">
        <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
          Round 3 Finalist Hackathon Demonstration & Judging Blueprint
        </span>
        <h1 className="font-serif text-4xl text-ink font-normal">
          How to Test & Evaluate CampaignGuard (Top 50 Finalist Edition)
        </h1>
        <p className="text-[15px] text-charcoal font-sans leading-relaxed">
          Welcome Judges. This guide demonstrates the complete enterprise brand-governance system and verifies the three major capabilities delivered in Round 3: Multi-Role Access Control with Tokenized Invite Links, Visual OCR with Auto-Annotated Change Orders, and Cross-Campaign Governance Analytics.
        </p>

        {/* Official Round 3 PDF Download Banner */}
        <div className="p-4 bg-linen/80 rounded-2xl border border-signal-blue/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-signal-blue font-bold block">
              Official Round 3 Submission Dossier
            </span>
            <p className="text-xs text-charcoal font-medium leading-relaxed">
              Read the complete 8-page <strong>Round 3 Engineering Dossier (PDF)</strong> detailing RBAC architecture, Gemini multimodal spatial bounding box extraction, live analytics formulas, and test matrices.
            </p>
          </div>
          <a
            href="/CampaignGuard_Round3_Submission.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-twilight hover:bg-ink text-paper text-xs font-mono font-medium rounded-xl transition-all shadow-xs shrink-0 inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Download PDF Dossier (8 Pages)</span>
            <ArrowRight className="w-3.5 h-3.5 text-signal-blue" />
          </a>
        </div>
      </div>

      {/* 5-Step Evaluation Sequence */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-ink font-normal">5-Minute Judge Walkthrough Sequence</h2>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] font-semibold text-twilight">STEP 1 • Explore Pre-Seeded Truth & Visual Contradictions</span>
              <span className="text-[11px] font-mono text-ash">0:00 - 1:00</span>
            </div>
            <p className="text-[13px] text-charcoal font-sans leading-relaxed">
              Open the <strong>Campaign Workspace</strong>. The benchmark campaign <span className="font-semibold text-ink">"EcoSip Weekend Flash Sale"</span> is pre-loaded with Contract v1 (20% off, 12hr cold claim, forbidden words: Miracle, guaranteed). Review the <strong>Preflight Inspection Findings</strong> tab to inspect the interactive SVG bounding box overlays highlighting violations directly on the banner visual alongside structured contract citations.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] font-semibold text-twilight">STEP 2 • Test Multi-Role Invite Links & RBAC (Feature 1)</span>
              <span className="text-[11px] font-mono text-ash">1:00 - 2:00</span>
            </div>
            <p className="text-[13px] text-charcoal font-sans leading-relaxed">
              As <strong>Brand Manager</strong>, open <strong>Team & Invites</strong>. Generate a real tokenized invite link for a <strong>Creator</strong> or <strong>Reviewer</strong>. Test opening the link in a new tab to see the custom invitation acceptance flow at <code>/invite</code>. Notice how permissions are scoped: Creators cannot alter contracts or sign approvals; Reviewers cannot silently edit creator assets.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] font-semibold text-twilight">STEP 3 • Change Order Workflow & Revision v2 (Feature 2)</span>
              <span className="text-[11px] font-mono text-ash">2:00 - 3:00</span>
            </div>
            <p className="text-[13px] text-charcoal font-sans leading-relaxed">
              Switch role to <strong>Creator</strong> (Alex Chen). Inspect the grouped <strong>Change Order Ticket</strong> for Banner Rev 1. Upload a revised asset or submit a correction note. Watch the automated re-analysis engine compare findings against the previous Change Order to track resolved vs. still-present issues in real time.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] font-semibold text-twilight">STEP 4 • Reviewer Verification & Cryptographic Version Lock</span>
              <span className="text-[11px] font-mono text-ash">3:00 - 4:00</span>
            </div>
            <p className="text-[13px] text-charcoal font-sans leading-relaxed">
              Switch role to <strong>Reviewer</strong> (Marcus Vance). Navigate to <strong>Authorised Review & Lock</strong>. Inspect the SHA-256 payload hash binding the exact asset revision to the active contract version. Click <span className="font-semibold text-twilight">"Execute Cryptographic Approval"</span>. If any asset is edited afterward, observe instant invalidation and drift detection!
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] font-semibold text-signal-blue">STEP 5 • Inspect Cross-Campaign Governance Analytics (Feature 3)</span>
              <span className="text-[11px] font-mono text-ash">4:00 - 5:00</span>
            </div>
            <p className="text-[13px] text-charcoal font-sans leading-relaxed">
              Open the <strong>Governance Analytics</strong> tab in the navigation bar. Inspect the 5 live operational KPI cards (Total Audited, Confirmed Violations, First-Pass Approval Rate, Average Revision Rounds, Sealed Campaigns). Explore the category violation breakdown and real-time workflow bottleneck tracker showing pending items by role.
            </p>
          </div>
        </div>
      </section>

      {/* Round 3 Submission Disclosures */}
      <section className="p-6 bg-linen rounded-2xl border border-mist space-y-6">
        <h2 className="font-serif text-2xl text-ink font-normal">Round 3 Delivered Improvements</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px] font-sans">
          <div className="p-4 bg-paper rounded-xl border border-mist/80 space-y-2">
            <h4 className="font-mono font-semibold text-twilight uppercase text-[12px]">
              1. Multi-Role RBAC & Invites
            </h4>
            <p className="text-charcoal leading-relaxed text-[12px]">
              Brand Managers issue cryptographically random invite tokens bound to specific roles and campaigns. Complete dedicated <code>/invite</code> acceptance portal with strict server-side permission gating.
            </p>
          </div>

          <div className="p-4 bg-paper rounded-xl border border-mist/80 space-y-2">
            <h4 className="font-mono font-semibold text-twilight uppercase text-[12px]">
              2. Visual OCR & Change Orders
            </h4>
            <p className="text-charcoal leading-relaxed text-[12px]">
              Gemini spatial coordinate extraction (<code>box_2d</code>) with responsive SVG overlays. Grouped Change Order tickets for creators with Revision v2 upload and re-analysis diffing.
            </p>
          </div>

          <div className="p-4 bg-paper rounded-xl border border-mist/80 space-y-2">
            <h4 className="font-mono font-semibold text-twilight uppercase text-[12px]">
              3. Governance Analytics
            </h4>
            <p className="text-charcoal leading-relaxed text-[12px]">
              Cross-campaign operational dashboard aggregating real active state. 5 KPI metrics, category violation distribution, and live workflow bottleneck monitoring by team role.
            </p>
          </div>
        </div>
      </section>

      {/* CTA back */}
      <div className="text-center pt-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-signal-blue text-signal-blue hover:bg-signal-blue/5 text-[14px] font-medium transition-colors"
        >
          Return to Campaign Console
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}