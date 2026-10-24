"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, History, ShieldAlert } from "lucide-react";
import { useRole } from "@/components/layout/RoleContext";

interface ApprovalPanelProps {
  campaign: any;
  onApproved: () => void;
}

export function ApprovalPanel({ campaign, onApproved }: ApprovalPanelProps) {
  const { currentUser } = useRole();
  const latestPack = campaign.packs?.[0];
  const activeContract = campaign.contracts?.find((c: any) => c.isActive) || campaign.contracts?.[0];
  const latestApproval = latestPack?.approvals?.[0];

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const pendingFindings = latestPack?.findings?.filter((f: any) => f.resolution === "PENDING") || [];
  const hasContradictions = pendingFindings.some((f: any) => f.status === "CONTRADICTED");
  const isApproved = campaign.status === "APPROVED";
  const isInvalidated = campaign.status === "INVALIDATED";

  const handleApprove = async () => {
    if (!latestPack) return;
    setLoading(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/packs/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          packId: latestPack.id,
          reviewerName: currentUser.name,
          reviewerRole: currentUser.role,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Cryptographic Version-Lock executed successfully. Campaign is officially Approved.");
        onApproved();
      } else {
        alert(data.error || "Approval failed");
      }
    } catch (e) {
      console.error(e);
      alert("Error approving pack");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateTamper = async () => {
    if (!latestPack) return;
    setLoading(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/packs/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          caption: "Tampered copy: Claiming 35% off on all items! (Unauthorized post-approval edit)",
          bannerBase64: latestPack.bannerBase64,
          bannerName: latestPack.bannerName,
          pdfText: latestPack.pdfText,
          actorName: "External Asset Modifier",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Out-of-band edit detected! Cryptographic lock was INSTANTLY REVOKED & INVALIDATED.");
        onApproved();
      }
    } catch (e) {
      console.error(e);
      alert("Error simulating asset change");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-paper rounded-2xl border border-mist p-6 space-y-6">
      <div className="border-b border-mist pb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
            Gatekeeper Review & Cryptographic Version-Lock
          </span>
          <h2 className="font-serif text-2xl text-ink font-normal">
            Authorised Review Package
          </h2>
          <p className="text-[13px] text-charcoal font-sans mt-0.5">
            Approvals are cryptographically tied to exact asset hashes and contract versions. Any alteration instantly resets the state to Invalidated.
          </p>
        </div>
      </div>

      {/* Lock Status Diagram Card */}
      <div className="p-4 bg-linen rounded-xl border border-mist space-y-3 font-mono text-[12px]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-mist/80 pb-2">
          <span className="text-ash uppercase text-[10px]">Lock Architecture State</span>
          <span className="text-twilight font-semibold">
            {isApproved ? "LOCKED & BOUND" : isInvalidated ? "APPROVAL INVALIDATED" : "PENDING SIGN-OFF"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-ink">
          <div className="p-2.5 bg-paper rounded-lg border border-mist">
            <span className="text-[10px] uppercase text-ash block">Campaign Contract</span>
            <span className="font-semibold">Version {activeContract?.version || 1}</span>
            <span className="text-[11px] text-charcoal block truncate">{activeContract?.offerPercent}% offer</span>
          </div>

          <div className="p-2.5 bg-paper rounded-lg border border-mist">
            <span className="text-[10px] uppercase text-ash block">Asset Revision Hash</span>
            <span className="font-semibold text-signal-blue">
              {latestPack?.packHash ? latestPack.packHash.slice(0, 12) : "none"}
            </span>
            <span className="text-[11px] text-charcoal block">Rev {latestPack?.revision || 1} Payload</span>
          </div>

          <div className="p-2.5 bg-paper rounded-lg border border-mist">
            <span className="text-[10px] uppercase text-ash block">Approval Binding Hash</span>
            <span className="font-semibold text-charcoal">
              {latestApproval ? `Lock #${latestApproval.id.slice(-6)}` : "Not locked yet"}
            </span>
            <span className="text-[11px] text-charcoal block">
              {latestApproval ? new Date(latestApproval.approvedAt).toLocaleTimeString() : "Awaiting signature"}
            </span>
          </div>
        </div>
      </div>

      {/* Invalidation Alert Banner */}
      {isInvalidated && (
        <div className="p-4 bg-status-error-bg border border-status-error-border rounded-xl text-status-error flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-[13px] font-sans">
            <h4 className="font-semibold font-mono text-[13px]">Cryptographic Lock Invalidation Triggered</h4>
            <p className="mt-0.5 text-charcoal">
              A creator edited asset copy or a brand manager revised the Campaign Contract after the previous approval. The campaign state has been revoked to prevent publishing non-compliant assets.
            </p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 bg-status-pass-bg border border-status-pass-border text-status-pass rounded-xl text-[13px] flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Warning if unaddressed critical contradictions remain */}
      {hasContradictions && !isApproved && (
        <div className="p-4 bg-status-warn-bg border border-status-warn-border rounded-xl text-status-warn flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-[13px] font-sans">
            <h4 className="font-semibold font-mono text-[13px]">Unresolved Contradictions Remaining</h4>
            <p className="mt-0.5 text-charcoal">
              {pendingFindings.length} findings are still pending resolution. Approving now constitutes an explicit exception override that will be permanently logged in the audit trail.
            </p>
          </div>
        </div>
      )}

      {/* Reviewer Note Input */}
      {!isApproved && (
        <div className="space-y-2">
          <label className="text-[12px] font-mono uppercase tracking-wider text-charcoal font-semibold">
            Authorised Reviewer Audit Notes & Exception Justification
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter review decision notes, accepted deviations, or sign-off rationale..."
            className="w-full bg-linen border border-mist rounded-xl p-3 text-[13px] text-ink focus:border-twilight outline-none font-sans"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 border-t border-mist flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[12px] font-mono text-ash">
          Reviewer: <strong className="text-ink">{currentUser.name}</strong> ({currentUser.title})
        </span>

        {isApproved ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-status-pass font-mono text-[13px] font-medium bg-status-pass-bg px-3 py-1.5 rounded-lg border border-status-pass-border">
              <CheckCircle2 className="w-4 h-4 text-status-pass" />
              <span>Approved & Version-Locked (Rev {latestPack?.revision})</span>
            </div>
            <button
              onClick={handleSimulateTamper}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-lg border border-status-error text-status-error hover:bg-status-error-bg text-xs font-mono font-medium transition-colors cursor-pointer active:scale-95 shadow-xs flex items-center gap-1.5"
              title="Test the instant revocation protocol by simulating an out-of-band asset edit"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{loading ? "Revoking..." : "Simulate Asset Tamper (Test Revocation)"}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            {!latestPack && (
              <span className="text-[11px] font-mono text-status-warn">
                Submit an asset revision in Creator tab first
              </span>
            )}
            <button
              onClick={handleApprove}
              disabled={loading || !latestPack}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-twilight text-paper bg-dusk hover:bg-twilight transition-colors text-[14px] font-medium flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className={`w-4 h-4 text-signal-blue ${loading ? "animate-spin" : ""}`} />
              {loading ? "Locking Revision..." : "Execute Cryptographic Approval"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}