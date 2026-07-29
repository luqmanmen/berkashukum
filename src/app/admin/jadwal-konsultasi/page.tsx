import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { updateBookingStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function JadwalKonsultasiPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q || "";

  const bookings = await prisma.consultationBooking.findMany({
    where: {
      ...(q ? { id: { contains: q, mode: 'insensitive' } } : {})
    },
    orderBy: { createdAt: "desc" },
    include: {
      lawyer: true
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Jadwal Konsultasi</h1>
        <form method="GET" action="/admin/jadwal-konsultasi" className="flex items-center gap-2">
          <input 
            type="text" 
            name="q" 
            defaultValue={q} 
            placeholder="Cari Booking ID..." 
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-64 focus:ring-2 focus:ring-gold focus:border-transparent outline-none" 
          />
          <button type="submit" className="bg-navy hover:bg-navy-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Cari
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Klien
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jadwal & Lawyer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total / Bukti
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Belum ada data jadwal konsultasi.
                </td>
              </tr>
            ) : bookings.map((b) => (
              <tr key={b.id}>
                <td className="px-6 py-4">
                  <div className="font-mono text-xs font-semibold text-navy mb-1">{b.id}</div>
                  <div className="text-sm font-medium text-gray-900">{b.clientName}</div>
                  <div className="text-sm text-gray-500">WA: {b.clientPhone}</div>
                  <div className="text-xs text-gray-400 truncate max-w-[200px]" title={b.caseDescription}>
                    {b.caseDescription}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium text-gray-900">
                    {new Date(b.scheduleDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })} - {b.scheduleTime}
                  </div>
                  <div className="text-xs mt-1">Lawyer: {b.lawyer.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="font-bold text-gray-900">Rp {b.totalAmount.toLocaleString("id-ID")}</div>
                  {b.paymentProof ? (
                    <a href={b.paymentProof} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs mt-1 block">
                      Lihat Bukti
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 mt-1 block">Belum ada bukti</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    b.status === "PAID" ? "bg-green-100 text-green-800" :
                    b.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                    b.status === "COMPLETED" ? "bg-blue-100 text-blue-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {b.status === "PENDING" && (
                    <form action={updateBookingStatus}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="PAID" />
                      <button type="submit" className="text-green-600 hover:text-green-900 mr-3">
                        Verifikasi Pembayaran
                      </button>
                    </form>
                  )}
                  {b.status === "PAID" && (
                    <form action={updateBookingStatus}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="COMPLETED" />
                      <button type="submit" className="text-blue-600 hover:text-blue-900 mr-3">
                        Selesaikan
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
