import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import BookingFormClient from "./BookingFormClient";

export const dynamic = "force-dynamic";

export default async function BookingPage({ params }: { params: Promise<{ lawyerId: string }> }) {
  const resolvedParams = await params;
  const lawyer = await prisma.lawyer.findUnique({
    where: { id: resolvedParams.lawyerId }
  });

  if (!lawyer || !lawyer.isActive) {
    notFound();
  }

  // Handle booking form submission
  async function submitBooking(formData: FormData) {
    "use server";
    
    const clientName = formData.get("clientName") as string;
    const clientEmail = formData.get("clientEmail") as string;
    const clientPhone = formData.get("clientPhone") as string;
    const caseDescription = formData.get("caseDescription") as string;
    const scheduleDate = formData.get("scheduleDate") as string;
    const scheduleTime = formData.get("scheduleTime") as string;

    const booking = await prisma.consultationBooking.create({
      data: {
        lawyerId: lawyer!.id,
        clientName,
        clientEmail,
        clientPhone,
        caseDescription,
        scheduleDate,
        scheduleTime,
        totalAmount: lawyer!.consultationPrice,
        status: "PENDING"
      }
    });

    redirect(`/konsultasi/pembayaran/${booking.id}`);
  }

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Booking Konsultasi</h1>
          <div className="gold-divider mx-auto mb-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-navy mb-6">Lengkapi Data Anda</h2>
              <BookingFormClient submitAction={submitBooking} />
            </div>
          </div>

          {/* Right Column: Lawyer Info & Price */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Ringkasan Pesanan</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                  {lawyer.photo ? (
                    <Image src={lawyer.photo} alt={lawyer.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-navy text-sm">{lawyer.name}</div>
                  <div className="text-xs text-gold font-bold mt-1">{lawyer.specialization}</div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Durasi Konsultasi</span>
                  <span className="font-medium text-navy">45 Menit</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Biaya Layanan</span>
                  <span className="font-medium text-navy">
                    {lawyer.consultationPrice === 0 ? "Gratis" : `Rp ${lawyer.consultationPrice.toLocaleString("id-ID")}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-navy">Total</span>
                  <span className="text-xl font-bold text-gold">
                    {lawyer.consultationPrice === 0 ? "Gratis" : `Rp ${lawyer.consultationPrice.toLocaleString("id-ID")}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
