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

export const metadata: Metadata = {
  title: "Dr. Satria Wibowo, S.H., M.H., Ph.D. | Pakar Hukum & Kurator Kepailitan",
  description: "Website personal Dr. Satria Wibowo. Menyediakan layanan konsultasi hukum premium, kurator kepailitan, dan template dokumen hukum berstandar tinggi.",
};

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
