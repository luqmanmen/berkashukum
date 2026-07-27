export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const productId = searchParams.get("productId");

    if (!token || !productId) {
      return NextResponse.json({ error: "Token dan Product ID diperlukan" }, { status: 400 });
    }

    const secret = new TextEncoder().encode(process.env.DOWNLOAD_SECRET || "fallback_secret_only_for_dev_very_insecure");

    try {
      // Verifikasi token (akan error jika expired)
      const { payload } = await jwtVerify(token, secret);
      
      const products = payload.products as Array<{ id: string; name: string; fileUrl: string }>;
      const product = products.find((p) => p.id === productId);

      if (!product) {
        return NextResponse.json({ error: "Produk tidak ditemukan dalam token ini" }, { status: 404 });
      }

      // Token valid, produk cocok. Redirect ke file URL sesungguhnya.
      // (Bisa juga stream file, tapi redirect lebih cepat untuk file besar di Supabase/Cloud)
      return NextResponse.redirect(product.fileUrl);

    } catch (jwtError) {
      console.error("JWT Verification failed:", jwtError);
      return NextResponse.json(
        { error: "Link unduhan tidak valid atau sudah kadaluarsa (lebih dari 10 menit)." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Download file error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}
