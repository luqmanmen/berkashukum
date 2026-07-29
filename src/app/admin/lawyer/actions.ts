"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createLawyer(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const specialization = formData.get("specialization") as string;
  const description = formData.get("description") as string;
  const consultationPrice = parseFloat((formData.get("consultationPrice") as string) || "0");
  const isActive = formData.get("isActive") === "on";
  
  // Capture availableTimes & availableDays
  const availableTimes = formData.getAll("availableTimes") as string[];
  const availableDays = formData.getAll("availableDays") as string[];

  let photoUrl: string | undefined = undefined;
  const photoFile = formData.get("photo") as File | null;
  
  if (photoFile && photoFile.size > 0) {
    const ext = photoFile.name.split('.').pop();
    const fileName = `lawyer-${Date.now()}.${ext}`;
    
    const { supabase } = await import("@/lib/supabase");
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`lawyers/${fileName}`, photoFile, { upsert: true });
      
    if (!error && data) {
      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(`lawyers/${fileName}`);
      photoUrl = publicUrlData.publicUrl;
    }
  }

  await prisma.lawyer.create({
    data: {
      name,
      specialization,
      description,
      consultationPrice,
      isActive,
      availableTimes,
      availableDays,
      photo: photoUrl,
    },
  });

  redirect("/admin/lawyer");
}

export async function updateLawyer(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const specialization = formData.get("specialization") as string;
  const description = formData.get("description") as string;
  const consultationPrice = parseFloat((formData.get("consultationPrice") as string) || "0");
  const isActive = formData.get("isActive") === "on";

  // Capture availableTimes & availableDays
  const availableTimes = formData.getAll("availableTimes") as string[];
  const availableDays = formData.getAll("availableDays") as string[];

  let photoUrl: string | undefined = undefined;
  const photoFile = formData.get("photo") as File | null;
  
  if (photoFile && photoFile.size > 0) {
    const ext = photoFile.name.split('.').pop();
    const fileName = `lawyer-${Date.now()}.${ext}`;
    
    const { supabase } = await import("@/lib/supabase");
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`lawyers/${fileName}`, photoFile, { upsert: true });
      
    if (!error && data) {
      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(`lawyers/${fileName}`);
      photoUrl = publicUrlData.publicUrl;
    }
  }

  const updateData: any = {
    name,
    specialization,
    description,
    consultationPrice,
    isActive,
    availableTimes,
    availableDays,
  };

  if (photoUrl) {
    updateData.photo = photoUrl;
  }

  await prisma.lawyer.update({
    where: { id },
    data: updateData,
  });

  redirect("/admin/lawyer");
}

export async function deleteLawyer(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  await prisma.lawyer.delete({
    where: { id },
  });

  redirect("/admin/lawyer");
}
