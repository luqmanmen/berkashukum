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
  const coverImage = formData.get("coverImage") as string || null;

  // Generate simple slug
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  await prisma.article.create({
    data: {
      title,
      slug: `${slug}-${Date.now()}`, // append timestamp to ensure uniqueness
      category,
      content,
      externalUrl,
      status,
      coverImage,
      authorId: session.user.id,
    },
  });

  redirect("/admin/artikel");
}
