"use client";

import React, { useState } from "react";
import { Upload, Image as ImageIcon, FileText, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useRole } from "@/components/layout/RoleContext";

interface PackUploaderProps {
  campaign: any;
  onInspectionComplete: () => void;
  onViewFindings?: () => void;
}

export function PackUploader({ campaign, onInspectionComplete, onViewFindings }: PackUploaderProps) {
  const { currentUser } = useRole();
  const latestPack = campaign?.packs?.[0];
  const isDemoCampaign = campaign?.id === "camp_ecosip_01";

  const [caption, setCaption] = useState(
    latestPack?.caption ||
      (isDemoCampaign
        ? "Stay refreshed this weekend with EcoSip! Enjoy 20% off our premium flasks. Miracle cold retention promises 24 hours guaranteed chill for everyone!"
        : "")
  );
  const [bannerName, setBannerName] = useState(
    latestPack?.bannerName || (isDemoCampaign ? "ecosip_weekend_banner.png" : "")
  );
  const [bannerBase64, setBannerBase64] = useState<string | null>(latestPack?.bannerBase64 || null);
  const [pdfText, setPdfText] = useState(
    latestPack?.pdfText ||
      (isDemoCampaign
        ? "EcoSip 750ml Spec Sheet: Lab tested cold retention up to 12 hours. Offer: 20% discount on selected models through October 31."
        : "")
  );

  const handleFillSample = () => {
    setCaption("Stay refreshed this weekend with EcoSip! Enjoy 20% off our premium flasks. Miracle cold retention promises 24 hours guaranteed chill for everyone!");
    setBannerName("ecosip_weekend_banner.png");
    setPdfText("EcoSip 750ml Spec Sheet: Lab tested cold retention up to 12 hours. Offer: 20% discount on selected models through October 31.");
  };

  const handleClear = () => {
    setCaption("");
    setBannerName("");
    setBannerBase64(null);
    setPdfText("");
  };

  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionStage, setInspectionStage] = useState("");
  const [inspectionSuccess, setInspectionSuccess] = useState<any | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setBannerBase64(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunInspection = async () => {
    setIsInspecting(true);
    setInspectionStage("Checking Layer 1: Deterministic Campaign Facts & Numbers...");

    setTimeout(() => {
      setInspectionStage("Checking Layer 2: Cross-Asset Consistency (Caption vs Banner vs PDF)...");
    }, 700);

    setTimeout(() => {
      setInspectionStage("Checking Layer 3: Brand Superlatives & Required Disclaimers...");
    }, 1400);

    setTimeout(() => {
      setInspectionStage("Checking Layer 4: Multimodal Vision & Accessibility Alt-Text...");
    }, 2100);

    try {
      const res = await fetch("/api/packs/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          caption,
          bannerBase64,
          bannerName,
          pdfText,
          pdfName: "spec_sheet.pdf",
          actorName: currentUser.name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInspectionSuccess({
          revision: data.pack?.revision || (latestPack?.revision || 0) + 1,
          hash: data.pack?.packHash ? data.pack.packHash.slice(0, 12) : "computed",
          findingsCount: data.findings?.length ?? data.pack?.findings?.length ?? 0,
        });
        onInspectionComplete();
      } else {
        alert(data.error || "Inspection failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error executing preflight inspection");
    } finally {
      setIsInspecting(false);
      setInspectionStage("");
    }
  };

  return (
    <div className="bg-paper rounded-2xl border border-mist p-6 space-y-6">
      <div className="border-b border-mist pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
          Creator Submission Pack
        </span>
        <h2 className="font-serif text-2xl text-ink font-normal">
          Asset Review Pack {latestPack ? `(Current: Rev ${latestPack.revision})` : "(New Revision)"}
        </h2>
        <p className="text-[13px] text-charcoal font-sans mt-0.5">
          Submit promotional copy, banner images, and specification sheets. Any edit recalculates the cryptographic revision hash and re-verifies campaign truth.
        </p>
      </div>

      {/* Preflight Completion Banner with Direct Navigation Button */}
      {inspectionSuccess && (
        <div className="p-4 bg-status-pass-bg border border-status-pass-border text-status-pass rounded-xl text-[13px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-status-pass" />
            <span>
              Preflight Inspection Complete: Pack Rev {inspectionSuccess.revision} locked (Hash: {inspectionSuccess.hash}...). {inspectionSuccess.findingsCount} findings flagged.
            </span>
          </div>
          {onViewFindings && (
            <button
              onClick={onViewFindings}
              className="px-3.5 py-1.5 rounded-lg bg-status-pass text-paper hover:opacity-90 font-medium text-xs font-sans flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
            >
              <span>View Findings ({inspectionSuccess.findingsCount})</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Caption Editor */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-[12px] font-mono uppercase tracking-wider text-charcoal font-semibold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-ash" />
            Social Copy / Instagram Caption
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillSample}
              className="text-[11px] font-mono text-signal-blue hover:underline cursor-pointer"
              title="Populate test copy for fast testing"
            >
              ⚡ Fill Sample Copy
            </button>
            <span className="text-mist">•</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-mono text-ash hover:text-ink hover:underline cursor-pointer"
            >
              Clear
            </button>
            <span className="text-mist">•</span>
            <span className="text-[11px] font-mono text-ash">{caption.length} chars</span>
          </div>
        </div>
        <textarea
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Type or paste the campaign copy here (or click 'Fill Sample Copy' above)..."
          className="w-full bg-linen border border-mist rounded-xl p-3 text-[14px] text-ink focus:border-twilight outline-none font-sans leading-relaxed"
        />
      </div>

      {/* Grid: Banner Image + Technical PDF Spec */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Banner Upload Box */}
        <div className="space-y-2">
          <label className="text-[12px] font-mono uppercase tracking-wider text-charcoal font-semibold flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-ash" />
            Banner Asset (PNG / JPEG)
          </label>
          <div className="border border-dashed border-mist rounded-xl p-4 bg-linen text-center relative hover:border-twilight/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {bannerBase64 ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={bannerBase64}
                  alt="Banner preview"
                  className="max-h-28 rounded-lg object-contain border border-mist shadow-sm"
                />
                <span className="text-[12px] font-mono text-ink truncate max-w-xs">{bannerName}</span>
                <span className="text-[11px] text-signal-blue font-medium">Click to replace image</span>
              </div>
            ) : (
              <div className="py-4 flex flex-col items-center gap-1.5 text-ash">
                <Upload className="w-6 h-6 text-charcoal" />
                <span className="text-[13px] font-medium text-ink">Upload campaign banner image</span>
                <span className="text-[11px] font-mono">PNG, JPEG up to 10MB</span>
                {bannerName && <span className="text-[11px] font-mono text-charcoal mt-1">Preset: {bannerName}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Technical PDF Spec Sheet Content */}
        <div className="space-y-2">
          <label className="text-[12px] font-mono uppercase tracking-wider text-charcoal font-semibold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-ash" />
            Product Spec Document (PDF Extract)
          </label>
          <textarea
            rows={5}
            value={pdfText}
            onChange={(e) => setPdfText(e.target.value)}
            placeholder="Extracted product specifications, engineering limits, and legal terms..."
            className="w-full bg-linen border border-mist rounded-xl p-3 text-[13px] text-ink focus:border-twilight outline-none font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Preflight Inspection Execution Trigger */}
      <div className="pt-4 border-t border-mist flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {isInspecting ? (
            <div className="flex items-center gap-2 text-[13px] font-mono text-twilight">
              <span className="w-2 h-2 rounded-full bg-signal-blue animate-ping" />
              <span>{inspectionStage}</span>
            </div>
          ) : (
            <span className="text-[12px] font-mono text-ash">
              Inspects against Contract truth & computes cryptographic revision hash
            </span>
          )}
        </div>

        <button
          onClick={handleRunInspection}
          disabled={isInspecting}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-signal-blue text-signal-blue hover:bg-signal-blue/5 transition-all text-[14px] font-medium flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          {isInspecting ? "Inspecting 4 Layers..." : "Run Preflight Inspection"}
        </button>
      </div>
    </div>
  );
}