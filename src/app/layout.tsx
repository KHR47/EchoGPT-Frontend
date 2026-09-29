import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/shared/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EchoGPT - Modern Multi-AI Workspace",
  description:
    "Unified AI workspace aggregating 320+ models, real-time comparison battle mode, and intelligent browser side panel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-text antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
