import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JstCode - Just Code",
  description: "A professional multi-file React code editor with live preview",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jstcode.com'),
  icons: {
    icon: "/icon_B.png",
    apple: "/icon_B.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JstCode",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "JstCode - JavaScript & TypeScript Code Editor",
    description: "A powerful online code editor for JavaScript and TypeScript development",
    url: "https://jstcode.com",
    siteName: "JstCode",
    type: "website",
    images: [
      {
        url: "/jstcode.png",
        width: 1200,
        height: 630,
        alt: "JstCode Code Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JstCode - JavaScript & TypeScript Code Editor",
    description: "A powerful online code editor for JavaScript and TypeScript development",
    images: ["/jstcode.png"],
  },
};

export function generateViewport() {
  return {
    themeColor: "#0D1117",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
