"use client";
import { useRouter } from "next/navigation";

export default function TrackForm() {
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const code = new FormData(e.currentTarget).get("code").toString().trim().toUpperCase();
        if (code) router.push(`/order/${code.startsWith("CX-") ? code : `CX-${code}`}`);
      }}
      className="grid gap-3"
    >
      <label className="label">Order number<input name="code" required placeholder="CX-XXXXXX" className="input uppercase" /></label>
      <button className="btn-yellow w-full">Track order</button>
    </form>
  );
}
