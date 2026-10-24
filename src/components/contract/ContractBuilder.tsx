"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, FileText, Check, AlertCircle } from "lucide-react";
import { useRole } from "@/components/layout/RoleContext";

interface ContractBuilderProps {
  campaign: any;
  onSaved: () => void;
}

export function ContractBuilder({ campaign, onSaved }: ContractBuilderProps) {
  const { currentUser } = useRole();
  const activeContract = campaign.contracts?.find((c: any) => c.isActive) || campaign.contracts?.[0];

  const [market, setMarket] = useState(activeContract?.market || "India & Global");
  const [channel, setChannel] = useState(activeContract?.channel || "Instagram");
  const [audience, setAudience] = useState(activeContract?.audience || "General Public");
  const [offerPercent, setOfferPercent] = useState<number>(activeContract?.offerPercent || 20);
  const [eligibility, setEligibility] = useState(activeContract?.eligibility || "Selected bottles only");
  const [endDate, setEndDate] = useState(activeContract?.endDate || "2026-10-31");

  const [approvedClaims, setApprovedClaims] = useState<string[]>(
    activeContract?.approvedClaimsJson ? JSON.parse(activeContract.approvedClaimsJson) : ["Keeps drinks cold for up to 12 hours."]
  );
  const [newClaim, setNewClaim] = useState("");

  const [requiredQuals, setRequiredQuals] = useState<string[]>(
    activeContract?.requiredQualsJson ? JSON.parse(activeContract.requiredQualsJson) : ["On selected bottles."]
  );
  const [newQual, setNewQual] = useState("");

  const [prohibitedTerms, setProhibitedTerms] = useState<string[]>(
    activeContract?.prohibitedTermsJson ? JSON.parse(activeContract.prohibitedTermsJson) : ["Miracle", "guaranteed", "world's best"]
  );
  const [newProhibited, setNewProhibited] = useState("");

  const [variants, setVariants] = useState<any[]>(
    activeContract?.variantsJson ? JSON.parse(activeContract.variantsJson) : []
  );
  const [variantChannel, setVariantChannel] = useState("");
  const [variantOffer, setVariantOffer] = useState<number>(30);
  const [variantNotes, setVariantNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleAddClaim = () => {
    if (newClaim.trim()) {
      setApprovedClaims([...approvedClaims, newClaim.trim()]);
      setNewClaim("");
    }
  };

  const handleAddQual = () => {
    if (newQual.trim()) {
      setRequiredQuals([...requiredQuals, newQual.trim()]);
      setNewQual("");
    }
  };

  const handleAddProhibited = () => {
    if (newProhibited.trim()) {
      setProhibitedTerms([...prohibitedTerms, newProhibited.trim()]);
      setNewProhibited("");
    }
  };

  const handleAddVariant = () => {
    if (variantChannel.trim()) {
      setVariants([...variants, { channel: variantChannel.trim(), offerPercent: variantOffer, notes: variantNotes.trim() }]);
      setVariantChannel("");
      setVariantNotes("");
    }
  };

  const handleSaveContract = async () => {
    setLoading(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          market,
          channel,
          audience,
          offerPercent: Number(offerPercent),
          eligibility,
          endDate,
          approvedClaims,
          requiredQuals,
          prohibitedTerms,
          variants,
          actorName: currentUser.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Published Contract v${data.contract.version}. Prior approvals invalidated if any rules changed.`);
        onSaved();
      } else {
        alert(data.error || "Failed to save contract");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-paper rounded-2xl border border-mist p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-mist pb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
            Campaign Contract Truth Specification
          </span>
          <h2 className="font-serif text-2xl text-ink font-normal">
            Active Contract: v{activeContract?.version || 1}
          </h2>
          <p className="text-[13px] text-charcoal font-sans mt-0.5">
            Defines what this campaign is legally and factually allowed to claim. Any changes publish a new revision and automatically invalidate prior sign-offs.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-status-pass-bg border border-status-pass-border text-status-pass rounded-xl text-[13px] flex items-center gap-2 font-mono">
          <Check className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Core Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] uppercase font-mono text-ash mb-1">Target Market</label>
          <input
            type="text"
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            className="w-full bg-linen border-b border-charcoal/40 focus:border-twilight px-3 py-2 text-[14px] text-ink outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase font-mono text-ash mb-1">Primary Channel</label>
          <input
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full bg-linen border-b border-charcoal/40 focus:border-twilight px-3 py-2 text-[14px] text-ink outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase font-mono text-ash mb-1">Audience</label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full bg-linen border-b border-charcoal/40 focus:border-twilight px-3 py-2 text-[14px] text-ink outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase font-mono text-ash mb-1">Offer Percentage (%)</label>
          <input
            type="number"
            value={offerPercent}
            onChange={(e) => setOfferPercent(parseFloat(e.target.value) || 0)}
            className="w-full bg-linen border-b border-charcoal/40 focus:border-twilight px-3 py-2 text-[14px] text-ink outline-none font-mono font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase font-mono text-ash mb-1">Eligibility Scope</label>
          <input
            type="text"
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            className="w-full bg-linen border-b border-charcoal/40 focus:border-twilight px-3 py-2 text-[14px] text-ink outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase font-mono text-ash mb-1">End Date (Strict)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-linen border-b border-charcoal/40 focus:border-twilight px-3 py-2 text-[14px] text-ink outline-none font-mono"
          />
        </div>
      </div>

      {/* Approved Claims */}
      <div className="space-y-3 pt-2 border-t border-mist/80">
        <label className="block text-[12px] font-mono uppercase tracking-wider text-charcoal font-semibold">
          Approved Product Claims (Fact-Verified)
        </label>
        <div className="flex flex-wrap gap-2">
          {approvedClaims.map((claim, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-linen border border-mist rounded-pill text-[13px] text-ink font-sans">
              "{claim}"
              <button
                type="button"
                onClick={() => setApprovedClaims(approvedClaims.filter((_, i) => i !== idx))}
                className="text-ash hover:text-status-error"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add new approved claim e.g. Keeps drinks cold for up to 12 hours"
            value={newClaim}
            onChange={(e) => setNewClaim(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddClaim();
              }
            }}
            className="flex-1 bg-linen border-b border-mist focus:border-twilight px-3 py-1.5 text-[13px] text-ink outline-none"
          />
          <button
            type="button"
            onClick={handleAddClaim}
            className="px-3.5 py-1.5 text-[13px] font-medium border border-twilight rounded-lg text-twilight hover:bg-twilight hover:text-paper transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            Add Claim
          </button>
        </div>
      </div>

      {/* Prohibited Terms & Superlatives */}
      <div className="space-y-3 pt-2 border-t border-mist/80">
        <label className="block text-[12px] font-mono uppercase tracking-wider text-charcoal font-semibold">
          Prohibited Terms & Superlatives
        </label>
        <div className="flex flex-wrap gap-2">
          {prohibitedTerms.map((term, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-status-error-bg border border-status-error-border text-status-error rounded-pill text-[12px] font-mono">
              forbidden: "{term}"
              <button
                type="button"
                onClick={() => setProhibitedTerms(prohibitedTerms.filter((_, i) => i !== idx))}
                className="hover:opacity-70 p-0.5 cursor-pointer"
                title="Remove forbidden term"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add forbidden word e.g. Miracle, guaranteed, world's best"
            value={newProhibited}
            onChange={(e) => setNewProhibited(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddProhibited();
              }
            }}
            className="flex-1 bg-linen border-b border-mist focus:border-twilight px-3 py-1.5 text-[13px] text-ink outline-none"
          />
          <button
            type="button"
            onClick={handleAddProhibited}
            className="px-3.5 py-1.5 text-[13px] font-medium border border-twilight rounded-lg text-twilight hover:bg-twilight hover:text-paper transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            Add Prohibited Term
          </button>
        </div>
      </div>

      {/* Required Qualifications & Disclaimers */}
      <div className="space-y-3 pt-2 border-t border-mist/80">
        <label className="block text-[12px] font-mono uppercase tracking-wider text-charcoal font-semibold">
          Required Disclaimers & Qualifications
        </label>
        <div className="flex flex-wrap gap-2">
          {requiredQuals.map((qual, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-linen border border-mist rounded-pill text-[13px] text-charcoal">
              *{qual}
              <button
                type="button"
                onClick={() => setRequiredQuals(requiredQuals.filter((_, i) => i !== idx))}
                className="text-ash hover:text-status-error p-0.5 cursor-pointer"
                title="Remove disclaimer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add required disclaimer e.g. On selected bottles."
            value={newQual}
            onChange={(e) => setNewQual(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddQual();
              }
            }}
            className="flex-1 bg-linen border-b border-mist focus:border-twilight px-3 py-1.5 text-[13px] text-ink outline-none"
          />
          <button
            type="button"
            onClick={handleAddQual}
            className="px-3.5 py-1.5 text-[13px] font-medium border border-twilight rounded-lg text-twilight hover:bg-twilight hover:text-paper transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            Add Required Disclaimer
          </button>
        </div>
      </div>

      {/* Channel & Audience Variants */}
      <div className="space-y-3 pt-2 border-t border-mist/80">
        <label className="block text-[12px] font-mono uppercase tracking-wider text-charcoal font-semibold">
          Channel & Audience Variants (Prevent False Alarms)
        </label>
        <p className="text-[12px] text-ash">
          Specify valid variations (e.g. VIP subscribers get 30% off, while public Instagram gets 20%). Assets flagged under this channel will not trigger a discount error.
        </p>

        {variants.length > 0 && (
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-linen rounded-xl border border-mist text-[13px]">
                <div>
                  <span className="font-semibold text-ink font-mono">{v.channel}</span>:{" "}
                  <span className="font-mono text-signal-blue font-medium">{v.offerPercent}% off</span>
                  {v.notes && <span className="text-ash text-[12px] ml-2 font-sans">({v.notes})</span>}
                </div>
                <button
                  type="button"
                  onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                  className="text-ash hover:text-status-error p-1 cursor-pointer"
                  title="Remove variant"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Channel e.g. VIP Email Club"
            value={variantChannel}
            onChange={(e) => setVariantChannel(e.target.value)}
            className="bg-linen border-b border-mist px-3 py-1.5 text-[13px] text-ink outline-none"
          />
          <input
            type="number"
            placeholder="Discount % e.g. 30"
            value={variantOffer}
            onChange={(e) => setVariantOffer(parseFloat(e.target.value) || 0)}
            className="bg-linen border-b border-mist px-3 py-1.5 text-[13px] text-ink outline-none font-mono"
          />
          <input
            type="text"
            placeholder="Audience / Reason"
            value={variantNotes}
            onChange={(e) => setVariantNotes(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddVariant();
              }
            }}
            className="bg-linen border-b border-mist px-3 py-1.5 text-[13px] text-ink outline-none"
          />
          <button
            type="button"
            onClick={handleAddVariant}
            className="px-3 py-1.5 text-[13px] font-medium border border-twilight rounded-lg text-twilight hover:bg-twilight hover:text-paper transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            Add Variant Rule
          </button>
        </div>
      </div>

      {/* Save Action */}
      <div className="pt-4 border-t border-mist flex items-center justify-between">
        <span className="text-[12px] font-mono text-ash">
          Publishes as v{(activeContract?.version || 1) + 1} with author timestamp
        </span>
        <button
          onClick={handleSaveContract}
          disabled={loading}
          className="px-5 py-2.5 rounded-lg border border-twilight text-paper bg-dusk hover:bg-twilight transition-colors text-[14px] font-medium flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className={`w-4 h-4 ${loading ? "animate-spin text-signal-blue" : ""}`} />
          {loading ? "Publishing Truth Contract..." : `Publish Contract v${(activeContract?.version || 1) + 1}`}
        </button>
      </div>
    </div>
  );
}