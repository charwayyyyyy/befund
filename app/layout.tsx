import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "BeFund",
  description: "Decentralized crowdfunding on Ethereum"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-textPrimary antialiased">
        {children}
      </body>
    </html>
  );
}
