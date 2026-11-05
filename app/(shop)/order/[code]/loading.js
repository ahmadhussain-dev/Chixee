import { OrderSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="wrap pb-28 pt-10">
      <OrderSkeleton />
    </main>
  );
}
