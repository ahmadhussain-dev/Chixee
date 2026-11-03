import { requireAdmin } from "@/lib/auth";
import { fail } from "@/lib/api";
import { sseResponse } from "@/lib/orderEvents";
import { adminOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Live feed of new and updated orders for the admin panel.
export async function GET(req) {
  if (!(await requireAdmin())) return fail("Admins only.", 403);
  return sseResponse(req, { filter: () => true, shape: adminOrder });
}
