import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default async function PenyimpananPage() {
  // Ambil daftar file dari folder images
  const { data: images } = await supabase.storage.from("images").list("images", { limit: 1000 });
  // Ambil daftar file dari folder files
  const { data: documents } = await supabase.storage.from("images").list("files", { limit: 1000 });

  let allFiles = [
    ...(images || []).map((f: any) => ({ ...f, folder: "images", type: "Gambar" })),
    ...(documents || []).map((f: any) => ({ ...f, folder: "files", type: "Dokumen/ZIP" }))
  ];

  // Filter file kosong / placeholder
  allFiles = allFiles.filter((f: any) => f.name !== ".emptyFolderPlaceholder" && f.name !== "");

  // Urutkan berdasarkan yang paling baru diupload
  allFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Penyimpanan (Storage)</h1>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-sm border border-gray-200">
          Total: <span className="font-bold text-[#0a1628]">{allFiles.length} File</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Nama File</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tipe</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Ukuran</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Diupload Pada</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allFiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    <div className="text-4xl mb-3">📭</div>
                    <p>Belum ada file yang diupload ke server.</p>
                  </td>
                </tr>
              ) : (
                allFiles.map((file, idx) => {
                  const url = supabase.storage.from("images").getPublicUrl(`${file.folder}/${file.name}`).data.publicUrl;
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{file.type === "Gambar" ? "🖼️" : "📄"}</span>
                          <div>
                            <div className="font-medium text-gray-900 text-sm truncate max-w-[300px]" title={file.name}>
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-400">/{file.folder}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          file.type === "Gambar" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                        }`}>
                          {file.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {formatBytes(file.metadata?.size || 0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(file.created_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a 
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[#c9a84c] hover:text-[#0a1628] transition-colors border border-[#c9a84c] px-3 py-1.5 rounded-sm hover:bg-gray-100"
                        >
                          Lihat / Download
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
