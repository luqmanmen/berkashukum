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
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ["site_owner_name", "maintenance_mode"] } }
    });
    
    const ownerSetting = settings.find(s => s.key === "site_owner_name");
    const maintenanceSetting = settings.find(s => s.key === "maintenance_mode");

    if (ownerSetting) ownerName = ownerSetting.value;
    
    if (maintenanceSetting?.value === "true") {
      const { redirect } = await import("next/navigation");
      redirect("/maintenance");
    }
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
