import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Aval Designs — Bridal & Occasion Wear, Made to Fit You",
    template: "%s — Aval Designs",
  },
  description:
    "Aval Designs is a premium bridal and occasion-wear boutique offering ready pieces and full custom tailoring — measurements, fabric, and design, made for your exact fit.",
  openGraph: {
    siteName: "Aval Designs",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal-ink">
        {children}
      </body>
    </html>
  );
}
