import { FindingItem, CheckLayer } from "@/types";
import { runGeminiInspection, PreflightInspectionInput } from "./gemini";

export async function runFullPreflightInspection(input: PreflightInspectionInput): Promise<FindingItem[]> {
  const findings: FindingItem[] = [];
  const textCorpus = [input.caption, input.pdfText || ""].join("\n").toLowerCase();
  const rawCaption = input.caption || "";
  const rawPdf = input.pdfText || "";

  // -------------------------------------------------------------
  // LAYER 1: DETERMINISTIC FACTS (Discounts, Dates, Claims)
  // -------------------------------------------------------------
  const expectedOffer = input.contract.offerPercent; // e.g. 20
  
  // Regex search for discount numbers e.g. "30%", "20% off", "40 percent"
  const percentMatches = Array.from(rawCaption.matchAll(/(\d{1,2})\s*(?:%|percent)/gi));
  for (const match of percentMatches) {
    const foundPercent = parseFloat(match[1]);
    if (foundPercent !== expectedOffer) {
      // Check if it matches an approved channel variant
      const matchingVariant = input.contract.variants.find((v) => v.offerPercent === foundPercent);
      if (matchingVariant) {
        findings.push({
          layer: "FACTS",
          location: "Instagram Caption",
          issue: `Channel variant conflict (${foundPercent}% found on ${input.contract.channel})`,
          evidence: `Contract allows ${foundPercent}% discount only for [${matchingVariant.channel}], but this asset is targeted to [${input.contract.channel}]. Instagram contract allows only ${expectedOffer}%.`,
          suggestedFix: `Adjust discount to ${expectedOffer}% for public Instagram or retarget asset to ${matchingVariant.channel}.`,
          status: "CONTRADICTED",
          resolution: "PENDING",
        });
      } else {
        findings.push({
          layer: "FACTS",
          location: "Instagram Caption",
          issue: `Discount percentage mismatch (${foundPercent}% vs ${expectedOffer}%)`,
          evidence: `Extracted "${match[0]}" from caption. Campaign Contract v1 specifies ${expectedOffer}% off for ${input.contract.eligibility}.`,
          suggestedFix: `Replace "${match[0]}" with "${expectedOffer}% off".`,
          status: "CONTRADICTED",
          resolution: "PENDING",
        });
      }
    }
  }

  // Check Expiration Date
  if (input.contract.endDate) {
    // If text contains "November" or "December" when contract ends in October
    const contractMonth = new Date(input.contract.endDate).getMonth(); // e.g. Oct = 9
    if (contractMonth === 9) { // October
      if (textCorpus.includes("november") || textCorpus.includes("december")) {
        findings.push({
          layer: "FACTS",
          location: "Campaign Text",
          issue: "Offer expiration date extends beyond approved contract end date",
          evidence: `Asset mentions dates in November/December, but Campaign Contract strictly expires on ${input.contract.endDate}.`,
          suggestedFix: `Update validity text to conclude by ${input.contract.endDate}.`,
          status: "CONTRADICTED",
          resolution: "PENDING",
        });
      }
    }
  }

  // -------------------------------------------------------------
  // LAYER 2: BRAND RULES (Prohibited terms & Required Qualifiers)
  // -------------------------------------------------------------
  for (const term of input.contract.prohibitedTerms) {
    if (term.trim() && textCorpus.includes(term.toLowerCase().trim())) {
      findings.push({
        layer: "BRAND_RULES",
        location: "Campaign Copy",
        issue: `Prohibited terminology used: "${term}"`,
        evidence: `Contract Prohibited List forbids words: [${input.contract.prohibitedTerms.join(", ")}]. Found prohibited word "${term}".`,
        suggestedFix: `Remove or substitute "${term}" with brand-approved descriptive language.`,
        status: "CONTRADICTED",
        resolution: "PENDING",
      });
    }
  }

  // Check Required Qualifications
  for (const qual of input.contract.requiredQuals) {
    if (qual.trim() && !textCorpus.includes(qual.toLowerCase().trim())) {
      findings.push({
        layer: "BRAND_RULES",
        location: "Instagram Caption & Visuals",
        issue: `Mandatory legal qualification missing: "${qual}"`,
        evidence: `Campaign Contract mandates inclusion of disclaimer: "${qual}". Disclaimer was not found in submitted text or extracted assets.`,
        suggestedFix: `Append required qualification clause: "*${qual}"`,
        status: "CONTRADICTED",
        resolution: "PENDING",
      });
    }
  }

  // -------------------------------------------------------------
  // LAYER 3: CROSS-ASSET RECONCILIATION (Caption vs PDF vs Banner)
  // -------------------------------------------------------------
  // Check thermal claim: "24 hours" vs "12 hours"
  if (rawCaption.includes("24 hour") && (rawPdf.includes("12 hour") || input.contract.approvedClaims.some(c => c.includes("12 hour")))) {
    findings.push({
      layer: "CROSS_ASSET",
      location: "Cross-Asset (Caption vs Product Spec)",
      issue: "Thermal duration discrepancy between promotional caption and technical sheet",
      evidence: `Promotional caption promises "24 hours cold", but technical documentation specifies "up to 12 hours". Publishing conflicting performance specifications risks regulatory sanctions.`,
      suggestedFix: `Harmonize claims across all channels to the tested 12-hour metric: "Keeps drinks cold for up to 12 hours."`,
      status: "CONTRADICTED",
      resolution: "PENDING",
    });
  }

  // -------------------------------------------------------------
  // LAYER 4: ACCESSIBILITY CHECKS
  // -------------------------------------------------------------
  if (input.bannerBase64 && !input.caption.includes("#")) {
    findings.push({
      layer: "ACCESSIBILITY",
      location: "Banner Asset",
      issue: "Visual asset missing companion accessibility description / alt-text",
      evidence: "Banner uploaded without descriptive alt-text or screen-reader accessible caption companion tags.",
      suggestedFix: "Provide descriptive alt-text highlighting bottle model, color, and headline discount.",
      status: "INSUFFICIENT_EVIDENCE",
      resolution: "PENDING",
    });
  }

  // -------------------------------------------------------------
  // GEMINI MULTIMODAL INTELLIGENCE AUGMENTATION
  // -------------------------------------------------------------
  const geminiFindings = await runGeminiInspection(input);
  
  // Merge findings, avoiding duplicate issues
  for (const gf of geminiFindings) {
    const isDuplicate = findings.some(
      (f) => f.layer === gf.layer && (f.issue.toLowerCase().includes(gf.issue.toLowerCase().slice(0, 15)) || gf.issue.toLowerCase().includes(f.issue.toLowerCase().slice(0, 15)))
    );
    if (!isDuplicate) {
      findings.push(gf);
    }
  }

  return findings;
}