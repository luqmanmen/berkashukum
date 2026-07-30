"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateArticle(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const externalUrl = formData.get("externalUrl") as string | null;
  const status = formData.get("status") as string;
  const isTrending = formData.get("isTrending") === "on" || formData.get("isTrending") === "true";
  const authorName = formData.get("authorName") as string | null;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) throw new Error("Article not found");

  // Let slug remain the same to not break SEO/links, 
  // unless we specifically want to update it. Here we keep it simple and preserve the old slug.

  let coverImageUrl = article.coverImage;
  const coverImageEntry = formData.get("coverImage");
  
  if (typeof coverImageEntry === 'string' && coverImageEntry.startsWith('http')) {
    coverImageUrl = coverImageEntry;
  } else if (coverImageEntry instanceof File && coverImageEntry.size > 0) {
    const ext = coverImageEntry.name.split('.').pop();
    const fileName = `articles/${Date.now()}.${ext}`;
    
    const { supabase } = await import("@/lib/supabase");
    
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, coverImageEntry, { upsert: true });
      
    if (!error && data) {
      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
      coverImageUrl = publicUrlData.publicUrl;
    }
  }

  const updateData: any = {
    title,
    category,
    content,
    externalUrl,
    status,
    isTrending,
    authorName: authorName || null,
  };

  if (coverImageUrl) {
    updateData.coverImage = coverImageUrl;
  }

  await prisma.article.update({
    where: { id },
    data: updateData,
  });

  return { success: true };
}
