// Loading skeletons: grey/yellow shapes in the same layout as the real content, with a moving shine
// (styles in globals.css). Server-safe, so route loading.js files can use them too.

export function Bone({ className = "", tone = "", style }) {
  return <span aria-hidden="true" style={style} className={`skel block ${tone ? `skel-${tone}` : ""} ${className}`} />;
}

// Screen readers get one short status instead of a pile of empty shapes.
export function Loading({ label = "Loading", className = "", children }) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">{label}…</span>
      {children}
    </div>
  );
}

export function MenuCardSkeleton() {
  return (
    <div className="flex gap-3.5 rounded-[18px] bg-white p-3 shadow-[0_0_0_1px_var(--color-line)] sm:gap-[18px] sm:p-4">
      <Bone tone="y" className="aspect-square w-[108px] flex-none rounded-[14px] sm:w-[42%] sm:max-w-[190px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-1">
        <Bone className="h-4 w-3/4" />
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-2/3" />
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Bone className="h-4 w-16" />
          <Bone className="h-9 w-24 rounded-[11px] sm:h-11 sm:w-32" />
        </div>
      </div>
    </div>
  );
}

export function MenuSkeleton({ sections = 2 }) {
  return (
    <Loading label="Loading the menu" className="wrap grid gap-10 py-8">
      {Array.from({ length: sections }, (_, s) => (
        <section key={s} className="grid gap-5">
          <div className="grid gap-2.5">
            <Bone tone="y" className="h-4 w-24" />
            <Bone className="h-8 w-44 rounded-xl" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => <MenuCardSkeleton key={i} />)}
          </div>
        </section>
      ))}
    </Loading>
  );
}

export function DealCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[18px] bg-maroon shadow-[0_12px_26px_rgba(107,13,17,.25)]">
      <Bone tone="y" className="aspect-[4/3] rounded-none" />
      <div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-4">
        <Bone tone="d" className="h-4 w-3/4" />
        <Bone tone="d" className="h-3 w-full" />
        <Bone tone="d" className="h-3 w-1/2" />
        <div className="mt-3 flex items-end justify-between gap-2">
          <Bone tone="d" className="h-5 w-20" />
          <Bone tone="d" className="size-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DealsSkeleton() {
  return (
    <Loading label="Loading deals" className="wrap grid gap-6 pb-10 pt-3 sm:pt-5">
      <Bone className="h-9 w-40" />
      <Bone className="aspect-[16/11] w-full rounded-[24px] sm:aspect-[24/7]" />
      <Bone className="h-6 w-48 rounded-lg" />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <DealCardSkeleton key={i} />)}
      </div>
    </Loading>
  );
}

export function OrderSkeleton() {
  return (
    <Loading label="Loading your order" className="mx-auto grid max-w-2xl gap-5">
      <div className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="grid gap-2.5">
            <Bone className="h-3.5 w-28" />
            <Bone className="h-8 w-48 rounded-xl" />
          </div>
          <Bone className="h-8 w-44" />
        </div>
        <div className="mt-8 grid gap-6">
          {[70, 45, 55, 50, 35].map((w, i) => (
            <div key={i} className="flex items-center gap-4">
              <Bone className="size-8 flex-none rounded-full" />
              <Bone className="h-3.5" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>
      <div className="card grid gap-3 p-6">
        <Bone className="mb-1 h-5 w-36" />
        {[0, 1].map((i) => (
          <div key={i} className="flex justify-between gap-3"><Bone className="h-3.5 w-3/5" /><Bone className="h-3.5 w-16" /></div>
        ))}
        <div className="mt-2 grid gap-3 border-t border-line pt-4">
          <div className="flex justify-between gap-3"><Bone className="h-3.5 w-20" /><Bone className="h-3.5 w-16" /></div>
          <div className="flex justify-between gap-3"><Bone className="h-4 w-14" /><Bone className="h-4 w-20" /></div>
        </div>
      </div>
    </Loading>
  );
}

// "My orders" and similar lists of order rows.
export function OrderRowsSkeleton({ rows = 3 }) {
  return (
    <Loading label="Loading orders" className="grid gap-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="card flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="grid gap-2"><Bone className="h-4 w-28" /><Bone className="h-3 w-44" /></div>
          <div className="flex items-center gap-3"><Bone className="h-6 w-24" /><Bone className="h-4 w-16" /></div>
        </div>
      ))}
    </Loading>
  );
}

export function AdminOrderSkeleton() {
  return (
    <div className="card grid gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2"><Bone className="h-5 w-28" /><Bone className="h-5 w-24" /><Bone className="h-5 w-20" /></div>
          <Bone className="h-3 w-40" />
        </div>
        <Bone className="h-6 w-20" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((c) => (
          <div key={c} className="grid content-start gap-2">
            <Bone className="h-3 w-20" />
            <Bone className="h-3.5 w-3/4" />
            <Bone className="h-3.5 w-1/2" />
          </div>
        ))}
      </div>
      <div className="flex gap-2"><Bone className="h-9 w-28 rounded-lg" /><Bone className="h-9 w-20 rounded-lg" /></div>
    </div>
  );
}

export function AdminOrdersSkeleton({ count = 3 }) {
  return (
    <Loading label="Loading orders" className="grid gap-4">
      {Array.from({ length: count }, (_, i) => <AdminOrderSkeleton key={i} />)}
    </Loading>
  );
}

export function ReportsSkeleton() {
  return (
    <Loading label="Loading report" className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="card grid gap-2.5 p-5"><Bone className="h-3 w-24" /><Bone className="h-7 w-32 rounded-lg" /><Bone className="h-3 w-28" /></div>
        ))}
      </div>
      <div className="card grid gap-4 p-5">
        <Bone className="h-5 w-32" />
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex justify-between gap-3"><Bone className="h-3.5 w-2/5" /><Bone className="h-3.5 w-16" /></div>
        ))}
      </div>
    </Loading>
  );
}

// Rows for the delivery areas table: stacked cards on phones, the five-column grid from sm up.
export function AreaRowsSkeleton({ rows = 5 }) {
  return (
    <Loading label="Loading areas" className="sm:border-t sm:border-line">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="grid gap-3 border-t border-line p-4 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_96px_112px_64px_120px] sm:items-center sm:px-3 sm:py-3 sm:first:border-t-0">
          <Bone className="h-10 rounded-xl" />
          <Bone className="h-10 rounded-xl" />
          <Bone className="h-10 rounded-xl" />
          <Bone className="mx-auto h-5 w-9" />
          <Bone className="h-9 rounded-lg" />
        </div>
      ))}
    </Loading>
  );
}

export function SettingsSkeleton() {
  return (
    <Loading label="Loading settings" className="grid max-w-2xl gap-5">
      <Bone className="h-9 w-64 rounded-xl" />
      <div className="card grid gap-4 p-5">
        <Bone className="h-5 w-56" />
        <Bone className="h-3 w-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => <div key={i} className="grid gap-2"><Bone className="h-3 w-24" /><Bone className="h-11 rounded-xl" /></div>)}
        </div>
      </div>
      <div className="card flex items-center justify-between gap-4 p-5">
        <div className="grid gap-2"><Bone className="h-5 w-48" /><Bone className="h-3 w-40" /></div>
        <Bone className="h-7 w-12" />
      </div>
    </Loading>
  );
}
