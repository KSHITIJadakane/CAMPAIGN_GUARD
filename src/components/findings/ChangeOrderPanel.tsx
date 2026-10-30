"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Upload, FileText, ArrowRight, ShieldAlert, Check } from "lucide-react";
import { ChangeOrder, ChangeOrderIssue, Role } from "@/types";

interface ChangeOrderPanelProps {
  campaignId: string;
  changeOrders: ChangeOrder[];
  currentRole: Role;
  defaultCaption?: string;
  onRevisionSubmitted: () => void;
}

export function ChangeOrderPanel({
  campaignId,
  changeOrders,
  currentRole,
  defaultCaption = "",
  onRevisionSubmitted,
}: ChangeOrderPanelProps) {
  const [activeTab, setActiveTab] = useState<"TICKET" | "UPLOAD">("TICKET");
  const [caption, setCaption] = useState(
    defaultCaption ||
      "Stay refreshed this weekend with EcoSip! Enjoy 20% off our premium flasks on selected bottles. Keeps drinks cold for up to 12 hours. While stocks last!"
  );
  const [designerNote, setDesignerNote] = useState(
    "Corrected banner discount badge to 20%, added required disclaimer, and removed prohibited superlatives from copy."
  );
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const activeCo = changeOrders?.[0];

  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/packs/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          caption,
          bannerName: "ecosip_banner_rev2_corrected.png",
          designerNote,
          actorName: "Alex Chen",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setStatusMsg("Revision v2 successfully processed! Re-analysis issues updated.");
        setTimeout(() => {
          onRevisionSubmitted();
          setActiveTab("TICKET");
        }, 1200);
      } else {
        setStatusMsg(json.error || "Failed to submit revision.");
      }
    } catch (err) {
      setStatusMsg("Network error during revision submission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!activeCo) {
    return (
      <div className="p-6 bg-paper rounded-2xl border border-mist text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-status-pass mx-auto" />
        <h4 className="font-serif text-lg text-ink font-semibold">No Pending Change Orders</h4>
        <p className="text-xs text-charcoal font-sans">
          All creative asset revisions have been verified or no contradictions have been flagged.
        </p>
      </div>
    );
  }

  const resolvedCount = activeCo.issues.filter((i) => i.status === "RESOLVED").length;
  const totalCount = activeCo.issues.length;

  return (
    <div className="bg-paper rounded-2xl border border-mist shadow-subtle-card overflow-hidden space-y-0">
      {/* Header bar */}
      <div className="p-5 bg-linen/50 border-b border-mist flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-twilight uppercase">
              Change Order #{activeCo.id}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                activeCo.status === "RESOLVED"
                  ? "bg-status-pass/10 text-status-pass"
                  : activeCo.status === "SUBMITTED"
                  ? "bg-signal-blue/10 text-signal-blue"
                  : "bg-status-error/10 text-status-error"
              }`}
            >
              {activeCo.status}
            </span>
          </div>
          <h3 className="font-serif text-xl text-ink font-semibold mt-0.5">
            Asset Correction Ticket (Rev {activeCo.revision})
          </h3>
          <p className="text-xs text-charcoal font-sans">
            Assigned Creator: <strong>{activeCo.assignedCreator}</strong> • Progress:{" "}
            <span className="font-mono font-semibold text-twilight">
              {resolvedCount}/{totalCount} Issues Resolved
            </span>
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-paper border border-mist rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("TICKET")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "TICKET"
                ? "bg-twilight text-paper font-semibold"
                : "text-charcoal hover:text-ink"
            }`}
          >
            Correction Ticket
          </button>
          <button
            onClick={() => setActiveTab("UPLOAD")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1 ${
              activeTab === "UPLOAD"
                ? "bg-twilight text-paper font-semibold"
                : "text-charcoal hover:text-ink"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Submit Rev 2
          </button>
        </div>
      </div>

      {activeTab === "TICKET" ? (
        <div className="p-5 space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-charcoal font-semibold">
              Actionable Correction Items ({activeCo.issues.length})
            </h4>

            <div className="space-y-2.5">
              {activeCo.issues.map((issue, idx) => (
                <div
                  key={issue.id || idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                    issue.status === "RESOLVED"
                      ? "bg-status-pass/5 border-status-pass/30"
                      : "bg-paper border-mist"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-charcoal">
                      Item #{idx + 1} • {issue.location}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        issue.status === "RESOLVED"
                          ? "bg-status-pass/10 text-status-pass flex items-center gap-1"
                          : "bg-status-error/10 text-status-error flex items-center gap-1"
                      }`}
                    >
                      {issue.status === "RESOLVED" ? (
                        <>
                          <Check className="w-3 h-3" /> Resolved
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" /> Still Present
                        </>
                      )}
                    </span>
                  </div>

                  <p className="font-medium text-ink">{issue.issue}</p>
                  <p className="text-charcoal text-[11px]">
                    <strong>Required Fix:</strong> {issue.suggestedFix}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {activeCo.designerNote && (
            <div className="p-3 bg-linen/60 rounded-xl border border-mist/80 text-xs">
              <span className="font-mono text-[10px] text-ash uppercase block">
                Last Designer Note
              </span>
              <p className="text-charcoal italic mt-0.5 font-sans">{activeCo.designerNote}</p>
            </div>
          )}

          {currentRole === "CREATOR" && (
            <div className="pt-2">
              <button
                onClick={() => setActiveTab("UPLOAD")}
                className="w-full py-2.5 px-4 bg-twilight text-paper text-xs font-mono rounded-xl hover:bg-twilight/90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Upload Corrected Revision v2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Creator Revision v2 Upload Interface */
        <form onSubmit={handleSubmitRevision} className="p-5 space-y-4">
          <div className="p-3 bg-linen/50 rounded-xl border border-mist space-y-1">
            <h4 className="font-serif text-base text-ink font-semibold">
              Creator Studio • Submit Asset Revision v2
            </h4>
            <p className="text-xs text-charcoal font-sans">
              Provide the corrected copy or updated graphic. The preflight engine will automatically re-inspect and compare results against the open Change Order.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-charcoal font-medium">
              Corrected Social Caption Copy:
            </label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 bg-paper rounded-xl border border-mist text-ink text-xs focus:outline-none focus:border-twilight font-sans leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-charcoal font-medium">
              Designer Correction Note (Saved to Audit Log):
            </label>
            <input
              type="text"
              value={designerNote}
              onChange={(e) => setDesignerNote(e.target.value)}
              placeholder="e.g. Corrected banner discount to 20% and added legal qualifier."
              className="w-full px-3 py-2 bg-paper rounded-xl border border-mist text-ink text-xs focus:outline-none focus:border-twilight font-sans"
            />
          </div>

          {statusMsg && (
            <p className="text-xs font-mono text-signal-blue bg-signal-blue/10 p-2.5 rounded-lg border border-signal-blue/20">
              {statusMsg}
            </p>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 px-4 bg-twilight text-paper text-xs font-medium rounded-xl hover:bg-twilight/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Re-Running 4-Layer Preflight...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Submit Revision v2 & Run Automated Re-Analysis</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("TICKET")}
              className="px-4 py-2.5 bg-paper border border-mist text-charcoal text-xs font-mono rounded-xl hover:bg-mist/30 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
