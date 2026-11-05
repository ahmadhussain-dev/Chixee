import { MenuSkeleton } from "@/components/ui/Skeleton";

// Shown while a shop page is on its way. Menu cards only: the home banner has no skeleton.
export default function Loading() {
  return (
    <main className="pb-28">
      <MenuSkeleton />
    </main>
  );
}
