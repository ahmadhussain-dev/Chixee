import AuthCard from "@/components/auth/AuthCard";
import TrackForm from "@/components/checkout/TrackForm";
import RecentOrders from "@/components/orders/RecentOrders";

export const metadata = { title: "Track your order", description: "Check the live status of your Chixee order.", alternates: { canonical: "/track" } };

export default function TrackPage() {
  return (
    <AuthCard title="Track your order" subtitle="Enter your order number, or pick one of the orders placed on this phone.">
      <TrackForm />
      <RecentOrders />
    </AuthCard>
  );
}
