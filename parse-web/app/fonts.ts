import { Geist, Geist_Mono, PT_Serif } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const ptSerif = PT_Serif({
  weight: "400",
  variable: "--font-pt-serif",
});
