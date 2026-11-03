import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream p-6 text-center">
      <div>
        <p className="font-script text-3xl text-maroon">Oops</p>
        <h1 className="heading text-5xl">Page not found</h1>
        <p className="mt-2 text-muted">This page went missing like the last piece of broast.</p>
        <Link href="/" className="btn-yellow mt-6">Back to the menu</Link>
      </div>
    </main>
  );
}
