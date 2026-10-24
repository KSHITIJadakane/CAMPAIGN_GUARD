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
          Round 2 Hackathon Demonstration & Judging Blueprint
        </span>
        <h1 className="font-serif text-4xl text-ink font-normal">
          How to Test & Evaluate CampaignGuard
        </h1>
        <p className="text-[15px] text-charcoal font-sans leading-relaxed">
          Welcome Judges. This guide walks you through the 5 critical verification steps to validate the complete end-to-end workflow, architectural integrity, and cryptographic locking mechanism.
        </p>
      </div>

      {/* 5-Step Evaluation Sequence */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-ink font-normal">5-Minute Judge Walkthrough Sequence</h2>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] font-semibold text-twilight">STEP 1 • Explore Pre-Seeded Truth & Contradictions</span>
              <span className="text-[11px] font-mono text-ash">0:00 - 1:00</span>
            </div>
            <p className="text-[13px] text-charcoal font-sans leading-relaxed">
              Open the <strong>Campaign Workspace</strong>. The sample campaign <span className="font-semibold text-ink">"EcoSip Weekend Flash Sale"</span> is pre-loaded with Contract v1 (20% off, 12hr cold claim, forbidden words: Miracle, guaranteed). Review the <strong>Preflight Inspection Findings</strong> tab to see how the system flagged 4 contradictions across Campaign Facts, Brand Rules, and Cross-Asset Consistency.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] font-semibold text-twilight">STEP 2 • Switch to Creator & Run Preflight</span>
              <span className="text-[11px] font-mono text-ash">1:00 - 2:00</span>
            </div>
            <p className="text-[13px] text-charcoal font-sans leading-relaxed">
              Switch the role pill in the navigation bar to <strong>Creator</strong> (Alex Chen). Navigate to the <strong>Creator Pack Uploader</strong> tab. Edit the caption or click <span className="font-semibold text-signal-blue">"Run Preflight Inspection"</span>. Watch the live 4-layer inspection pipeline scan facts, cross-reconcile text, and compute a new SHA-256 payload hash in real-time.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] font-semibold text-twilight">STEP 3 • Accept Suggested Corrections</span>
              <span className="text-[11px] font-mono text-ash">2:00 - 3:00</span>
            </div>
            <p className="text-[13px] text-charcoal font-sans leading-relaxed">
              In the <strong>Preflight Inspection Findings</strong> tab, examine the ground truth evidence boxes. Click <span className="font-semibold text-signal-blue">"Accept Suggested Fix"</span> on a finding. Notice how the issue state updates cleanly to resolved and immediately records an entry in the permanent <strong>Audit Trail</strong>.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] font-semibold text-twilight">STEP 4 • Switch to Reviewer & Execute Cryptographic Lock</span>
              <span className="text-[11px] font-mono text-ash">3:00 - 4:00</span>
            </div>
            <p className="text-[13px] text-charcoal font-sans leading-relaxed">
              Switch role to <strong>Reviewer</strong> (Marcus Vance). Navigate to the <strong>Authorised Review & Lock</strong> tab. Inspect the Lock Architecture State diagram showing Contract version bound to Asset Revision Hash. Click <span className="font-semibold text-twilight">"Execute Cryptographic Approval"</span>. The campaign status changes to <span className="text-status-pass font-semibold">Approved & Locked</span>.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-5 bg-paper rounded-2xl border border-mist shadow-subtle-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] font-semibold text-status-error">STEP 5 • Test Instant Invalidation (The Signature Innovation)</span>
              <span className="text-[11px] font-mono text-ash">4:00 - 5:00</span>
            </div>
            <p className="text-[13px] text-charcoal font-sans leading-relaxed">
              Switch back to Creator or Brand Manager. Change a single word in the caption (e.g. change 20% to 25%) and run inspection, OR edit the Contract discount. Observe how the campaign status instantly resets from Approved to <span className="text-status-error font-semibold">Approval Invalidated</span> with a red banner, preventing accidental publication of unreviewed modifications!
            </p>
          </div>
        </div>
      </section>

      {/* Round 2 Submission Disclosures */}
      <section className="p-6 bg-linen rounded-2xl border border-mist space-y-6">
        <h2 className="font-serif text-2xl text-ink font-normal">Round 2 Required Disclosures</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] font-sans">
          <div className="p-4 bg-paper rounded-xl border border-mist/80 space-y-2">
            <h4 className="font-mono font-semibold text-twilight uppercase text-[12px]">
              Technology & AI Architecture
            </h4>
            <ul className="space-y-1.5 text-charcoal list-disc pl-4">
              <li><strong>Frontend & API:</strong> Next.js 14 App Router, TypeScript, Tailwind CSS</li>
              <li><strong>Database:</strong> Prisma ORM with SQLite (local) / PostgreSQL (Neon serverless on Vercel)</li>
              <li><strong>AI Engine:</strong> Google Gemini 1.5 Flash multimodal vision API for cross-asset reasoning</li>
              <li><strong>Deterministic Layer:</strong> Exact SQL/Regex rules for hard dates and discounts (zero hallucinations)</li>
              <li><strong>Security:</strong> SHA-256 cryptographic revision binding</li>
            </ul>
          </div>

          <div className="p-4 bg-paper rounded-xl border border-mist/80 space-y-2">
            <h4 className="font-mono font-semibold text-twilight uppercase text-[12px]">
              3 Major Round 3 Improvements
            </h4>
            <ul className="space-y-1.5 text-charcoal list-disc pl-4">
              <li><strong>1. Reusable Brand Profile Vault:</strong> Universal brand guidelines, logos, and prohibited lexicons imported once and inherited across all future campaigns.</li>
              <li><strong>2. Real-Time Slack & Notion Webhooks:</strong> Push automated preflight findings and one-click reviewer approvals directly into team chat workflows.</li>
              <li><strong>3. Governance Analytics Engine:</strong> Macro intelligence dashboard reporting recurring rule violations, chronic channel errors, and risk hot-spots across creators.</li>
            </ul>
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