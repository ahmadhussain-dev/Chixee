import { Resend } from "resend";

export async function sendResetEmail(to, name, link) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Development fallback: no key configured, print the link to the server console.
    console.log(`[reset-password] RESEND_API_KEY missing. Reset link for ${to}: ${link}`);
    return;
  }
  const resend = new Resend(key);
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Chixee <onboarding@resend.dev>",
    to,
    subject: "Reset your Chixee password",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;background:#FBF8F3;border-radius:16px">
        <h2 style="color:#A3161B;margin:0 0 12px">Reset your password</h2>
        <p>Hi ${name || "there"},</p>
        <p>We received a request to reset your Chixee password. This link works for 30 minutes.</p>
        <p style="margin:24px 0"><a href="${link}" style="background:#FFC20E;color:#6B0D11;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:bold">Choose a new password</a></p>
        <p style="color:#7A6A62;font-size:13px">If you didn't ask for this, you can ignore this email.</p>
      </div>`,
  });
}
