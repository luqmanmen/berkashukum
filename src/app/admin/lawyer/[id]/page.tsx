import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LawyerForm from "../baru/LawyerForm";

export const dynamic = "force-dynamic";

export default async function EditLawyerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const lawyer = await prisma.lawyer.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!lawyer) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 mb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Data Lawyer</h1>
        <p className="text-gray-500 text-sm mt-1">Ubah data profil pengacara / konsultan hukum.</p>
      </div>

      <LawyerForm initialData={lawyer} />
    </div>
  );
}
