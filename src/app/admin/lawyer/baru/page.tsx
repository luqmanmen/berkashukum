import LawyerForm from "./LawyerForm";

export default function BaruLawyerPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 mb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Lawyer Baru</h1>
        <p className="text-gray-500 text-sm mt-1">Masukkan data pengacara / konsultan hukum baru.</p>
      </div>

      <LawyerForm />
    </div>
  );
}
