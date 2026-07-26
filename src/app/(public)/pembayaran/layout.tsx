import { CartProvider } from "@/hooks/useCart";

export default function PembayaranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <main>{children}</main>
    </CartProvider>
  );
}

