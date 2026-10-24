// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CampaignGuard',
  description: 'AI‑powered campaign compliance checker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang= en className=dark suppressHydrationWarning>
      <body className={${inter.className} bg-gray-900 text-gray-100 min-h-screen flex flex-col}>
        <ThemeProvider attribute=class defaultTheme=dark enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
