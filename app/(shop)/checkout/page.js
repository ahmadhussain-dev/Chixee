import Link from "next/link";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <main className="wrap pb-28 pt-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-maroon">Home</Link>
        <span className="mx-2">›</span>
        <span className="font-semibold text-maroon">Checkout</span>
      </nav>
      <h1 className="sr-only">Checkout</h1>
      <CheckoutForm />
    </main>
  );
}
