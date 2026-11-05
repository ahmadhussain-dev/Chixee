import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminNav, { AdminActions } from "@/components/admin/AdminNav";
import Logo from "@/components/ui/Logo";

export const metadata = { title: { default: "Admin", template: "%s | Chixee Admin" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.user.role !== "admin") {
    return (
      <main className="grid min-h-screen place-items-center p-6 text-center">
        <div className="card max-w-sm p-8">
          <h1 className="heading text-3xl">Admins only</h1>
          <p className="mt-2 text-muted">This account doesn&apos;t have access to the admin panel.</p>
          <Link href="/" className="btn-yellow mt-5">Back to the site</Link>
        </div>
      </main>
    );
  }
  return (
    <div className="min-h-screen bg-cream md:grid md:grid-cols-[240px_1fr]">
      {/* Phones/tablets: a sticky top bar (logo, Home, Logout) with the section tabs under it. Desktop: sidebar. */}
      <aside className="sticky top-0 z-30 bg-night text-on-night shadow-[0_6px_18px_rgba(0,0,0,.18)] md:h-screen md:shadow-none">
        <div className="flex items-center gap-3 px-4 py-3 md:p-5">
          <Logo size={40} />
          <div><b className="block font-display text-lg font-normal leading-none text-yellow md:text-xl">CHIXEE</b><small className="text-xs text-on-night-muted md:text-sm">Admin panel</small></div>
          <AdminActions />
        </div>
        <AdminNav name={session.user.name} />
      </aside>
      <main className="min-w-0 p-4 sm:p-8">{children}</main>
    </div>
  );
}
