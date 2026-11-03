import AuthCard from "@/components/auth/AuthCard";
import TrackForm from "@/components/checkout/TrackForm";

export const metadata = { title: "Track your order", description: "Check the live status of your Chixee order.", alternates: { canonical: "/track" } };

export default function TrackPage() {
  return (
    <AuthCard title="Track your order" subtitle="Enter the order number shown after you placed your order.">
      <TrackForm />
    </AuthCard>
  );
}
