export const runtime = "edge";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  let siteName = "Corporate Legal Partner";
  let ownerName = "Berkas Hukum";
  let description = "Berkas Hukum Corporate. Menyediakan layanan konsultasi hukum premium, kurator kepailitan, dan template dokumen hukum berstandar tinggi.";
  
  return {
    title: `${ownerName} | ${siteName}`,
    description: description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-inter antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
