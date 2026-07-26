import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export default async function AdminPengaturanPage() {
  const settings = await prisma.siteSetting.findMany();

  // Convert to object map
  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Pengaturan Situs</h1>
        <p className="text-gray-500 text-sm mt-1">Kelola konfigurasi global website Anda.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
        <SettingsForm initialData={settingsMap} />
      </div>
    </div>
  );
}
