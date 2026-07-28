import Link from "next/link";
import EditArticleForm from "./EditArticleForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await prisma.article.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/artikel" className="text-gray-400 hover:text-navy transition-colors">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Edit Artikel</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
        <EditArticleForm initialData={article} />
      </div>
    </div>
  );
}
