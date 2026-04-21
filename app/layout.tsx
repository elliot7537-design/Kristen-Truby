import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kristen Truby · Christian Life Coach",
  description:
    "Kristen Truby helps women walk in truth and live in peace — Christ-centered life coaching for purpose, identity, and surrender.",
  openGraph: {
    title: "Kristen Truby · Christian Life Coach",
    description:
      "Christ-centered life coaching for purpose, identity, and surrender.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-cream-50 text-ink-900 antialiased">{children}</body>
    </html>
  );
}
