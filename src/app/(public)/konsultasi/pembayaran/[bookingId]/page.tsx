import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingPembayaranClient from "./BookingPembayaranClient";

export const dynamic = "force-dynamic";

export default async function BookingPembayaranPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = await params;
  
  const booking = await prisma.consultationBooking.findUnique({
    where: { id: resolvedParams.bookingId },
    include: { lawyer: true }
  });

  if (!booking) {
    notFound();
  }

  // Get Settings (QRIS, etc)
  const settings = await prisma.siteSetting.findMany();
  
  const qrisImage = settings.find((s) => s.key === "PAYMENT_QRIS_IMAGE")?.value || "";
  const danaPhone = settings.find((s) => s.key === "PAYMENT_DANA_PHONE")?.value || "";
  const bankAccountsStr = settings.find((s) => s.key === "PAYMENT_BANK_ACCOUNTS")?.value || "[]";
  const contactWa = settings.find((s) => s.key === "site_contact_whatsapp")?.value || "081296393972";
  
  let bankAccounts = [];
  try {
    bankAccounts = JSON.parse(bankAccountsStr);
  } catch(e) {}

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <BookingPembayaranClient 
        booking={booking} 
        qrisImage={qrisImage}
        danaPhone={danaPhone}
        bankAccounts={bankAccounts}
        contactWa={contactWa}
      />
    </div>
  );
}
