import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const progo = localFont({
  variable: "--font-progo",
  src: "../public/fonts/PROGO-Bold.otf",
  display: "swap",
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Filipino Profanity API",
  description:
    "Free API for Filipino and regional profanity words with real-time detection capabilities. 310 words across two language categories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${progo.variable} ${cormorant.variable} ${geistSans.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
