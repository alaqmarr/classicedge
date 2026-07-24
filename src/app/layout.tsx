import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import prisma from "@/lib/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Classic Edge 53",
    default: "Classic Edge 53 | Premium Acrylic Fabrication Machinery",
  },
  description: "Classic Edge 53 is a leading manufacturer of premium, high-precision industrial acrylic fabrication machines. Discover unmatched quality and reliability.",
  keywords: ["Classic Edge 53", "acrylic fabrication", "diamond edge polishing", "flame polishing machine", "CNC router", "acrylic bending"],
  openGraph: {
    title: "Classic Edge 53 | Premium Acrylic Fabrication Machinery",
    description: "Engineering Tomorrow's Acrylic Industry with state-of-the-art precision machinery.",
    url: "https://classicedge53.com",
    siteName: "Classic Edge 53",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-50">
        {children}
        <FloatingWhatsApp phoneNumber={settings?.whatsappNumber || null} />
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155'
          }
        }}/>
      </body>
    </html>
  );
}
