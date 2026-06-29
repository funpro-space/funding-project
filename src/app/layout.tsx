import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { OnchainProvider } from "@/components/providers/OnchainProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fun Pro | Project Development & Funding',
  description: 'We connect Web3 and the real-world economy. Through specialized tools and milestone-based funding, we empower artists, craftspeople, farmers, and sustainable producers to build and scale their projects.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  },
  openGraph: {
    title: 'Fun Pro | Project Development & Funding',
    description: 'We connect Web3 and the real-world economy. Through specialized tools and milestone-based funding, we empower artists, craftspeople, farmers, and sustainable producers to build and scale their projects.',
    url: 'https://funpro.space',
    type: 'website',
    images: [
      {
        url: 'https://funpro.space/app-screenshot.webp',
        width: 1200,
        height: 630,
        alt: 'Fun Pro App Screenshot',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fun Pro | Project Development & Funding',
    description: 'We connect Web3 and the real-world economy. Through specialized tools and milestone-based funding, we empower artists, craftspeople, farmers, and sustainable producers to build and scale their projects.',
    images: ['https://funpro.space/app-screenshot.webp'],
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