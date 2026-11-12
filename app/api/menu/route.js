import { getCatalog } from "@/lib/catalog";
import { ok, handle } from "@/lib/api";

// Public menu: categories with their items, and the deals (hidden ones left out).
export const GET = handle(async () => {
  const { MENU, DEALS, DEAL_GROUPS } = await getCatalog();
  return ok({ categories: MENU, deals: DEALS, dealGroups: DEAL_GROUPS });
});
