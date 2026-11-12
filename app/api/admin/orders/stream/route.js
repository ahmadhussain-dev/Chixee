import { route } from "@/lib/api";
import { sseResponse } from "@/lib/orderEvents";
import { adminOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Live feed of new and updated orders for the admin panel.
export const GET = route(async (req) => sseResponse(req, { filter: () => true, shape: adminOrder }), { auth: "admin" });
