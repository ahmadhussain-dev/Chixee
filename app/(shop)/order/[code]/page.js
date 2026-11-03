import OrderTracker from "@/components/checkout/OrderTracker";

export const metadata = { title: "Order status", robots: { index: false } };

export default async function OrderPage({ params, searchParams }) {
  const { code } = await params;
  const sp = await searchParams;
  return (
    <main className="wrap pb-28 pt-10">
      <OrderTracker code={code.toUpperCase()} isNew={sp?.new === "1"} />
    </main>
  );
}
