import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/components/layout/RoleContext";
import { Navbar } from "@/components/layout/Navbar";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#fefffc",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cg.kshitijpro.xyz"),
  title: {
    default: "CampaignGuard — Automated Preflight Governance for Marketing Campaigns",
    template: "%s | CampaignGuard",
  },
  description:
    "The automated spell-checker for brand facts, cross-asset consistency, and cryptographic version-locked approvals for modern marketing teams.",
  applicationName: "CampaignGuard",
  keywords: [
    "CampaignGuard",
    "ad verification",
    "marketing compliance",
    "brand governance",
    "preflight checker",
    "multimodal AI",
    "cross-asset reconciliation",
    "deterministic verification",
    "SHA-256",
  ],
  authors: [{ name: "CampaignGuard Team", url: "https://cg.kshitijpro.xyz" }],
  creator: "CampaignGuard",
  publisher: "CampaignGuard",
  alternates: {
    canonical: "https://cg.kshitijpro.xyz",
  },
  openGraph: {
    title: "CampaignGuard — Automated Preflight Governance for Marketing Campaigns",
    description:
      "When marketing teams launch cross-channel campaigns, captions claim 20% off while banner graphics announce 30%. CampaignGuard establishes a single human truth contract and reconciles assets across 4 automated inspection layers.",
    url: "https://cg.kshitijpro.xyz",
    siteName: "CampaignGuard",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampaignGuard — Automated Preflight Governance",
    description:
      "The automated spell-checker for brand facts, cross-asset consistency, and cryptographic version-locked approvals.",
    creator: "@CampaignGuard",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/icon.svg"],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-parchment text-ink flex flex-col selection:bg-signal-blue/20">
        <RoleProvider>
          <Navbar />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>
          <footer className="border-t border-mist/80 py-8 text-center text-xs font-mono text-ash bg-paper">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-semibold text-ink">CampaignGuard Preflight Protocol</span>
                <span className="text-mist">•</span>
                <span className="text-xs text-ash font-mono">cg.kshitijpro.xyz</span>
              </div>
              <span>Round 2 Functional MVP • Cryptographic Revision Lock</span>
            </div>
          </footer>
        </RoleProvider>
      </body>
    </html>
  );
}
