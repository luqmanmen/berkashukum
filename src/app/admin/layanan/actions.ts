"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createServiceItem(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const linkUrl = formData.get("linkUrl") as string | null;
  const order = parseInt((formData.get("order") as string) || "0", 10);
  
  let imageUrl: string | null = null;
  const imageEntry = formData.get("imageUrl");
  
  if (typeof imageEntry === 'string' && imageEntry.startsWith('http')) {
    imageUrl = imageEntry;
  } else if (imageEntry instanceof File && imageEntry.size > 0) {
    const ext = imageEntry.name.split('.').pop();
    const fileName = `services/${Date.now()}.${ext}`;
    
    const { supabase } = await import("@/lib/supabase");
    
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, imageEntry, { upsert: true });
      
    if (!error && data) {
      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }
  }

  await prisma.serviceCarousel.create({
    data: {
      name,
      description,
      linkUrl: linkUrl || null,
      imageUrl,
      order,
    },
  });

  revalidatePath("/");
  redirect("/admin/layanan");
}

export async function updateServiceItem(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const linkUrl = formData.get("linkUrl") as string | null;
  const order = parseInt((formData.get("order") as string) || "0", 10);
  
  const updateData: any = {
    name,
    description,
    linkUrl: linkUrl || null,
    order,
  };

  const imageEntry = formData.get("imageUrl");
  if (typeof imageEntry === 'string' && imageEntry.startsWith('http')) {
    updateData.imageUrl = imageEntry;
  } else if (imageEntry instanceof File && imageEntry.size > 0) {
    const ext = imageEntry.name.split('.').pop();
    const fileName = `services/${Date.now()}.${ext}`;
    
    const { supabase } = await import("@/lib/supabase");
    
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, imageEntry, { upsert: true });
      
    if (!error && data) {
      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
      updateData.imageUrl = publicUrlData.publicUrl;
    }
  }

  await prisma.serviceCarousel.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/");
  redirect("/admin/layanan");
}

export async function deleteServiceItem(id: string) {
  await prisma.serviceCarousel.delete({
    where: { id },
  });
  
  revalidatePath("/");
  redirect("/admin/layanan");
}
