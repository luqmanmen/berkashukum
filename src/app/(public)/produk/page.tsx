export const runtime = "edge";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductListClient from "./ProductListClient";

export const metadata: Metadata = {
  title: "Produk Digital Hukum | LexNova Law Firm",
  description: "Beli template dokumen hukum, e-book panduan hukum, dan paket konsultasi online dari LexNova Law Firm.",
};

const categoryIcons: Record<string, string> = {
  "Template Dokumen": "📄",
  "E-Book": "📚",
  "Konsultasi": "💬",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const productsData = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      _count: {
        select: { OrderItems: true }
      }
    },
    orderBy: { createdAt: "asc" },
  });

  const products = productsData.map(p => ({
    ...p,
    sales: p._count.OrderItems
  }));

  return (
    <>
      <ProductListClient initialProducts={products} />
    </>
  );
}
