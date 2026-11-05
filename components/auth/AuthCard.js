import Logo from "@/components/ui/Logo";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-[radial-gradient(circle_at_20%_0%,#fff4d1_0%,transparent_55%)] px-4 py-3 sm:py-12">
      <div className="w-[min(440px,100%)] animate-fade-up rounded-3xl bg-white px-4 py-5 shadow-[0_30px_70px_rgba(107,13,17,.12)] sm:p-8">
        {/* Logo beside the heading (not above it) so the whole form fits one phone screen */}
        <div className="mb-3.5 flex items-center gap-3 sm:mb-5 sm:gap-4">
          <Logo size={52} />
          <div className="min-w-0">
            <h1 className="heading text-[26px] leading-tight sm:text-[30px]">{title}</h1>
            {subtitle && <p className="mt-0.5 text-[13px] leading-snug text-muted sm:text-sm">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-medium text-maroon">{children}</p>;
}

export function FormSuccess({ children }) {
  if (!children) return null;
  return <p role="status" className="rounded-xl bg-green-50 px-3.5 py-2.5 text-sm font-medium text-green-800">{children}</p>;
}
