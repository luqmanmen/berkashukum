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
  let siteName = "Pakar Hukum & Kurator Kepailitan";
  let ownerName = "Dr. Satria Wibowo, S.H., M.H., Ph.D.";
  let description = "Website personal Dr. Satria Wibowo. Menyediakan layanan konsultasi hukum premium, kurator kepailitan, dan template dokumen hukum berstandar tinggi.";
  
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ["site_title", "site_owner_name", "site_description"] } }
    });
    
    settings.forEach(s => {
      if (s.key === "site_title") siteName = s.value;
      if (s.key === "site_owner_name") ownerName = s.value;
      if (s.key === "site_description") description = s.value;
    });
  } catch (e) {}

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
