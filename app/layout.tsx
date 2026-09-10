import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Chubby Hearts",
  description:
    "Welcome to the Jiturner Foster Family. Discover our family stories, meaningful memories, and special moments shared together.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} ${frankRuhlLibre.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
