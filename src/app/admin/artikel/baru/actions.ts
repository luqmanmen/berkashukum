"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createArticle(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const externalUrl = formData.get("externalUrl") as string | null;
  const status = formData.get("status") as string;

  // Generate simple slug
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  
  let coverImageUrl: string | null = null;
  const coverImageFile = formData.get("coverImage") as File | null;
  
  if (coverImageFile && coverImageFile.size > 0) {
    const ext = coverImageFile.name.split('.').pop();
    const fileName = `articles/images/${slug}-${Date.now()}.${ext}`;
    
    // Lazy import to avoid server components bundle issues if needed, but standard import is fine
    const { supabase } = await import("@/lib/supabase");
    
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, coverImageFile, { upsert: true });
      
    if (!error && data) {
      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
      coverImageUrl = publicUrlData.publicUrl;
    }
  }

  await prisma.article.create({
    data: {
      title,
      slug: `${slug}-${Date.now()}`, // append timestamp to ensure uniqueness
      category,
      content,
      externalUrl,
      status,
      coverImage: coverImageUrl,
      authorId: session.user.id,
    },
  });

  return { success: true };
}
