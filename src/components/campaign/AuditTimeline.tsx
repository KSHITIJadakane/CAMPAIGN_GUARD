"use client";

import React from "react";
import { History, ShieldCheck, FileEdit, CheckCircle2, ShieldAlert } from "lucide-react";

interface AuditTimelineProps {
  logs: any[];
}

export function AuditTimeline({ logs }: AuditTimelineProps) {
  const getIcon = (action: string) => {
    switch (action) {
      case "CONTRACT_CREATED":
        return <FileEdit className="w-4 h-4 text-signal-blue" />;
      case "PACK_SUBMITTED":
        return <History className="w-4 h-4 text-twilight" />;
      case "CHECK_COMPLETED":
        return <ShieldCheck className="w-4 h-4 text-ash" />;
      case "APPROVED":
        return <CheckCircle2 className="w-4 h-4 text-status-pass" />;
      case "INVALIDATED":
        return <ShieldAlert className="w-4 h-4 text-status-error" />;
      default:
        return <History className="w-4 h-4 text-ash" />;
    }
  };

  return (
    <div className="bg-paper rounded-2xl border border-mist p-6 space-y-4">
      <div className="border-b border-mist pb-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ash">
            Permanent Audit Trail
          </span>
          <h3 className="font-serif text-xl text-ink font-normal">Governance Decision Log</h3>
        </div>
        <span className="text-[11px] font-mono text-ash">{logs.length} logged events</span>
      </div>

      <div className="relative border-l border-mist ml-3 space-y-6 pt-2">
        {logs.map((log: any, idx: number) => (
          <div key={log.id || idx} className="relative pl-6 group">
            {/* Timeline node */}
            <div className="absolute -left-2.5 top-0.5 w-5 h-5 rounded-full bg-paper border border-mist flex items-center justify-center">
              {getIcon(log.action)}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink text-[13px] font-sans">{log.actorName}</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-pill bg-linen border border-mist text-charcoal">
                  {log.actorRole}
                </span>
              </div>
              <span className="text-[11px] font-mono text-ash">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-[13px] text-charcoal font-sans leading-relaxed">{log.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}