import { Inter, Plus_Jakarta_Sans, Manrope, Open_Sans } from "next/font/google";

import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "600", "700"],
  variable: "--font-inter",
});

const plus_jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: "500",
  variable: "--font-manrope",
});

const open_sans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
});

const SITE_NAME = "Perekup-pro";
const SITE_DESCRIPTION = "";

export const metadata: Metadata = {
  title: "Perekup-pro",
  description: " ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* HTML Meta Tags */}
        <title>{SITE_NAME}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        {/* Facebook Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SITE_NAME} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className={`${inter.className} ${plus_jakarta.className} ${manrope.className} ${open_sans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
