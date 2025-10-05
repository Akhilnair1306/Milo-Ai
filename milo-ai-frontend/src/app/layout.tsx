import type React from "react";
import type { Metadata } from "next";
import { Inter, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  display: "swap",
  preload: true,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Milo AI - Emotional Support for Alzheimer's & Dementia",
  description:
    "Milo AI is an emotional support companion designed for people with Alzheimer's and dementia — remembering everything about you and offering personalized care.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={` ${plusJakartaSans.variable} antialiased`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
