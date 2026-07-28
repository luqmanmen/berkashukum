import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminLawyerPage() {
  const lawyers = await prisma.lawyer.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Lawyer</h1>
        <Link 
          href="/admin/lawyer/baru" 
          className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          + Tambah Lawyer
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lawyer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spesialisasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarif (Rp)
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
            {lawyers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Belum ada data lawyer.
                </td>
              </tr>
            ) : lawyers.map((lawyer) => (
              <tr key={lawyer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden bg-gray-100">
                      {lawyer.photo ? (
                        <Image src={lawyer.photo} alt={lawyer.name} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">?</div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{lawyer.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lawyer.specialization}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  Rp {lawyer.consultationPrice.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    lawyer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {lawyer.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/lawyer/${lawyer.id}`} className="text-navy hover:text-gold mr-4">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
