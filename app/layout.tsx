import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Godawari Nursery | Botanical Garden Store",
  description: "An immersive plant boutique showcasing heritage greenhouse collections, expert care, and premium garden design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-ivory text-charcoal antialiased">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
