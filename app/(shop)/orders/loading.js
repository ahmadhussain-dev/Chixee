import { Bone, OrderRowsSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="wrap max-w-3xl pb-28 pt-10">
      <Bone className="mb-6 h-10 w-52 rounded-xl" />
      <OrderRowsSkeleton />
    </main>
  );
}
