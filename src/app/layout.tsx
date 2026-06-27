import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { OnchainProvider } from "@/components/providers/OnchainProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Funding Project Onchain',
  description: 'AI Project Sandbox and Financial Tranches',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  },
  other: {
    'base:app_id': '6a3e896b18b12c552e1c5232',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-200 antialiased`}>
        <OnchainProvider>
          {children}
        </OnchainProvider>
      </body>
    </html>
  );
}