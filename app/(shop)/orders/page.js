import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import MyOrders from "@/components/checkout/MyOrders";

export const metadata = { title: "My orders", robots: { index: false } };

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/orders");
  return (
    <main className="wrap max-w-3xl pb-28 pt-10">
      <h1 className="heading mb-6 text-4xl">My orders</h1>
      <MyOrders />
    </main>
  );
}
