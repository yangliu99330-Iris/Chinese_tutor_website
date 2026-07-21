import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  title: "Chinese Tutor Yang | Mandarin & Dance Lessons",
  description:
    "Learn Mandarin Chinese and Chinese Dance with Miss Yang. Professional, personalized lessons for all ages and levels. Book your first lesson today.",
  keywords:
    "Chinese tutor, Mandarin lessons, Chinese dance, language learning, HSK preparation",
  openGraph: {
    title: "Chinese Tutor Yang | Mandarin & Dance Lessons",
    description:
      "Professional Mandarin Chinese and Chinese Dance lessons tailored to your learning goals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} ${notoSerifSC.variable} font-inter antialiased`}
      >
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
