import { createHash } from "crypto";

export function computePackHash(caption: string, bannerBase64?: string | null, pdfText?: string | null): string {
  const hasher = createHash("sha256");
  hasher.update("v1::caption::" + (caption || "").trim());
  if (bannerBase64) {
    // Hash banner content
    hasher.update("::banner::" + bannerBase64.slice(0, 5000) + "::len=" + bannerBase64.length);
  }
  if (pdfText) {
    hasher.update("::pdf::" + pdfText.trim());
  }
  return hasher.digest("hex").slice(0, 16);
}
