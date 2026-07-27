export const runtime = "edge";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PembayaranClient from "./PembayaranClient";


export default async function PembayaranPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Get site settings for QRIS and Bank
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: { in: ["PAYMENT_QRIS_IMAGE", "PAYMENT_DANA_PHONE"] },
    },
  });

  const qrisImage = settings.find((s) => s.key === "PAYMENT_QRIS_IMAGE")?.value || "";
  const danaPhone = settings.find((s) => s.key === "PAYMENT_DANA_PHONE")?.value || "081296393972";

  return (
    <PembayaranClient
      order={JSON.parse(JSON.stringify(order))}
      qrisImage={qrisImage}
      danaPhone={danaPhone}
    />
  );
}
