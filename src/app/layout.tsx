import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "CampaignGuard — Automated Preflight Checker for Marketing Campaigns",
  description:
    "Cross-asset consistency, deterministic fact validation, and cryptographic version-locked approvals for marketing teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-parchment text-ink flex flex-col">
        <RoleProvider>
          <Navbar />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>
          <footer className="border-t border-mist/80 py-8 text-center text-[12px] font-mono text-ash bg-paper">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-serif text-[14px] text-ink">CampaignGuard Preflight Protocol</span>
              <span>Round 2 MVP • Hackathon Build 2026 • Verified on Vercel</span>
            </div>
          </footer>
        </RoleProvider>
      </body>
    </html>
  );
}