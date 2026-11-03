import { dbConnect } from "@/lib/db";
import Setting from "@/models/Setting";
import { ok, handle } from "@/lib/api";

export const dynamic = "force-dynamic";

// Public: payment details shown on checkout for account transfer.
export const GET = handle(async () => {
  await dbConnect();
  const s = (await Setting.findOne({ key: "store" }).lean()) || {};
  return ok({
    bankName: s.bankName || "",
    accountTitle: s.accountTitle || "",
    accountNumber: s.accountNumber || "",
    iban: s.iban || "",
    jazzcashNumber: s.jazzcashNumber || "",
    jazzcashTitle: s.jazzcashTitle || "",
    acceptingOrders: s.acceptingOrders ?? true,
  });
});
