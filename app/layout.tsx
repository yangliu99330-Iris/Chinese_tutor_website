import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { siteJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Softer Song-style serif used as the fallback for Chinese characters
// throughout the site (Playfair/Inter don't cover CJK glyphs).
const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Online Chinese Tutor | Mandarin & Chinese Dance Lessons",
  description:
    "Learn Mandarin Chinese or Chinese dance online with Miss Yang — friendly one-to-one lessons for kids, teens and adults, from complete beginner to HSK prep.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Online Chinese Tutor | Mandarin & Chinese Dance Lessons",
    description:
      "Friendly one-to-one online Mandarin and Chinese dance lessons with Miss Yang, for all ages and levels.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} ${notoSerifSC.variable} font-inter antialiased`}
      >
        <JsonLd data={siteJsonLd()} />
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
