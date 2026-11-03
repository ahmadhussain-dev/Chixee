import { sseResponse } from "@/lib/orderEvents";
import { publicOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Vercel closes long requests; the browser reconnects automatically

// Live status for one order (customer tracking page).
export async function GET(req, { params }) {
  const code = String((await params).code).toUpperCase();
  return sseResponse(req, { filter: (o) => o.code === code, shape: publicOrder });
}
