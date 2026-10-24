import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CampaignGuard — Automated Preflight Governance";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#fefffc",
          backgroundImage:
            "radial-gradient(at 10% 10%, rgba(65, 161, 207, 0.12) 0px, transparent 40%), radial-gradient(at 90% 90%, rgba(40, 40, 52, 0.08) 0px, transparent 45%)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#282834",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#41a1cf",
              fontSize: "28px",
              boxShadow: "0 4px 20px rgba(40, 40, 52, 0.2)",
            }}
          >
            🛡️
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "30px",
                fontWeight: "700",
                color: "#171717",
                letterSpacing: "-0.5px",
              }}
            >
              CampaignGuard
            </span>
            <span
              style={{
                fontSize: "13px",
                fontFamily: "monospace",
                color: "#646464",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              Preflight Protocol
            </span>
          </div>
        </div>

        {/* Center Main Punchline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "980px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "20px",
              backgroundColor: "#f9faf7",
              border: "1px solid #dee2de",
              width: "fit-content",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#41a1cf",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                fontFamily: "monospace",
                color: "#444141",
              }}
            >
              Automated Campaign Verification & Compliance
            </span>
          </div>

          <h1
            style={{
              fontSize: "56px",
              fontWeight: "600",
              color: "#171717",
              lineHeight: "1.15",
              margin: 0,
              letterSpacing: "-1.5px",
            }}
          >
            The automated spell-checker for{" "}
            <span style={{ color: "#0081c0", fontStyle: "italic" }}>brand facts</span> and campaign consistency.
          </h1>

          <p
            style={{
              fontSize: "22px",
              color: "#444141",
              lineHeight: "1.4",
              margin: 0,
            }}
          >
            Deterministic fact checking, multimodal cross-asset reconciliation, and cryptographic SHA-256 version locks.
          </p>
        </div>

        {/* Bottom Feature Badges & Domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #dee2de",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                backgroundColor: "#f9faf7",
                border: "1px solid #dee2de",
                fontSize: "14px",
                color: "#171717",
                fontWeight: "500",
              }}
            >
              ✓ 4 Inspection Layers
            </span>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                backgroundColor: "#f9faf7",
                border: "1px solid #dee2de",
                fontSize: "14px",
                color: "#171717",
                fontWeight: "500",
              }}
            >
              ✓ Zero Hallucinations
            </span>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                backgroundColor: "#f9faf7",
                border: "1px solid #dee2de",
                fontSize: "14px",
                color: "#171717",
                fontWeight: "500",
              }}
            >
              ✓ SHA-256 Immutability
            </span>
          </div>

          <span
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
              fontWeight: "600",
              color: "#0081c0",
            }}
          >
            cg.kshitijpro.xyz
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
