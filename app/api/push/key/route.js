import { ok, route } from "@/lib/api";
import { getVapid } from "@/lib/push";

export const dynamic = "force-dynamic";

// Public key the browser needs to subscribe to notifications.
export const GET = route(async () => ok({ publicKey: (await getVapid()).publicKey }));
