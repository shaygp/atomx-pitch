import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ATOMX - Pitch Deck | Colosseum Hackathon 2025',
  description: 'Decentralized Arbitrage Execution Protocol on Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
