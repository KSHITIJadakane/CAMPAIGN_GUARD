import React from "react";
import Link from "next/link";
import { ArrowUpRight, FileCheck, Layers, AlertCircle, ShieldCheck } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useRole } from "@/components/layout/RoleContext";

interface CampaignCardProps {
  campaign: any;
  onSelect: (campaign: any) => void;
}

export function CampaignCard({ campaign, onSelect }: CampaignCardProps) {
  const { currentRole } = useRole();

  const activeContract = campaign.contracts?.find((c: any) => c.isActive) || campaign.contracts?.[0];
  const latestPack = campaign.packs?.[0];
  const pendingFindings = latestPack?.findings?.filter((f: any) => f.resolution === "PENDING") || [];

  return (
    <div className="bg-paper rounded-2xl border border-mist p-6 shadow-subtle-card hover:border-twilight/40 transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
              {campaign.brand}
            </span>
            <h3 className="font-serif text-2xl text-ink font-normal tracking-tight group-hover:text-twilight transition-colors">
              {campaign.title}
            </h3>
            <p className="text-[13px] text-charcoal font-sans mt-0.5">
              Product: <span className="font-medium text-ink">{campaign.product}</span>
            </p>
          </div>
          <StatusBadge status={campaign.status} />
        </div>

        {/* Metadata Specs Grid */}
        <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-linen rounded-xl border border-mist/70 text-[12px] font-mono">
          <div>
            <span className="text-ash block text-[10px] uppercase">Contract Truth</span>
            <span className="text-ink font-medium">
              v{activeContract?.version || 1} • {activeContract?.offerPercent || 20}% off
            </span>
          </div>
          <div>
            <span className="text-ash block text-[10px] uppercase">Active Pack</span>
            <span className="text-ink font-medium">
              {latestPack ? `Rev ${latestPack.revision} [${latestPack.packHash.slice(0, 8)}]` : "None submitted"}
            </span>
          </div>
          <div>
            <span className="text-ash block text-[10px] uppercase">Channel & Market</span>
            <span className="text-charcoal truncate block">
              {activeContract?.channel || "Instagram"} ({activeContract?.market || "Global"})
            </span>
          </div>
          <div>
            <span className="text-ash block text-[10px] uppercase">Unresolved Findings</span>
            <span className={pendingFindings.length > 0 ? "text-status-error font-semibold" : "text-status-pass font-medium"}>
              {pendingFindings.length} issues flagged
            </span>
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-4 border-t border-mist/80 flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono text-ash">
          Updated {new Date(campaign.updatedAt || campaign.createdAt).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(campaign)}
            className="text-[13px] font-medium px-3 py-1.5 rounded-lg border border-signal-blue text-signal-blue hover:bg-signal-blue/5 transition-colors flex items-center gap-1"
          >
            Open Console
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}