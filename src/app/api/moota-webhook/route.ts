import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderSuccessEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("signature"); // Signature Moota untuk validasi
    // TODO: Validasi signature dengan secret Moota Anda

    const body = await req.json();
    
    // Moota biasanya mengirim array mutasi
    const mutations = Array.isArray(body) ? body : [body];

    for (const mutation of mutations) {
      // Cek jika mutasi adalah uang masuk (Credit/CR)
      if (mutation.type === "CR" || parseFloat(mutation.amount) > 0) {
        const amount = parseFloat(mutation.amount);

        // Cari pesanan PENDING yang nominalnya sama persis (termasuk kode unik)
        const order = await prisma.order.findFirst({
          where: {
            status: "PENDING",
            totalAmount: amount,
          },
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        });

        if (order) {
          // Update status pesanan menjadi PAID
          await prisma.order.update({
            where: { id: order.id },
            data: { status: "PAID" },
          });
          
          console.log(`Order ${order.id} paid via Moota (Amount: ${amount})`);
          
          // Kirim email yang berisi link download ke pembeli
          const downloadItems = order.items.map(item => ({
            name: item.product.name,
            url: item.product.digitalFile || "#" // Fallback jika tidak ada link
          }));
          
          await sendOrderSuccessEmail(
            order.buyerEmail,
            order.buyerName,
            order.id,
            downloadItems
          );
        }
      }
    }

    return NextResponse.json({ status: "OK", message: "Webhook processed" });
  } catch (error: any) {
    console.error("Moota Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
