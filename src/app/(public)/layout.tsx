import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/hooks/useCart";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let ownerName = "Dr. Satria Wibowo";
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "site_owner_name" } });
    if (setting) ownerName = setting.value;
  } catch (e) {}

  return (
    <CartProvider>
      <ScrollToTop />
      <Navbar ownerName={ownerName} />
      <main>{children}</main>
      <Footer ownerName={ownerName} />
    </CartProvider>
  );
}
