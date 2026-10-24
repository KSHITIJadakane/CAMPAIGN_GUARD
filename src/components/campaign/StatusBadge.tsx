import React from "react";
import { CheckCircle2, AlertTriangle, ShieldAlert, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const isSm = size === "sm";

  switch (status) {
    case "APPROVED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-pill border bg-status-pass-bg text-status-pass border-status-pass-border ${
            isSm ? "text-[11px] px-2 py-0.5" : "text-[12px] px-2.5 py-1"
          }`}
        >
          <CheckCircle2 className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Approved & Locked
        </span>
      );

    case "INVALIDATED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-pill border bg-status-error-bg text-status-error border-status-error-border animate-pulse ${
            isSm ? "text-[11px] px-2 py-0.5" : "text-[12px] px-2.5 py-1"
          }`}
        >
          <ShieldAlert className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Approval Invalidated
        </span>
      );

    case "NEEDS_REVIEW":
    case "FINDINGS":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-pill border bg-status-warn-bg text-status-warn border-status-warn-border ${
            isSm ? "text-[11px] px-2 py-0.5" : "text-[12px] px-2.5 py-1"
          }`}
        >
          <AlertTriangle className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Needs Review
        </span>
      );

    case "DRAFT":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-pill border bg-linen text-charcoal border-mist ${
            isSm ? "text-[11px] px-2 py-0.5" : "text-[12px] px-2.5 py-1"
          }`}
        >
          <Clock className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Draft Brief
        </span>
      );
  }
}