import { Resend } from "resend";
import { SITE } from "@/data/site";
import { EMAIL_LOGO_PNG_BASE64 } from "@/lib/email-logo";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const firstName = (name) => {
  const f = String(name || "").trim().split(/\s+/)[0];
  return f ? f[0].toUpperCase() + f.slice(1) : "there";
};

// Branded shell shared by every Chixee email: maroon header with the logo, white card, contacts footer.
// Table layout + inline styles so it renders the same in Gmail, Outlook and phone mail apps.
function layout({ origin, preheader, body }) {
  // Inline attachment (see sendResetEmail), not a link to the site, so it always loads.
  const logo = "cid:chixee-logo";
  const wa = SITE.whatsapp;
  const link = (href, text) => `<a href="${href}" style="color:#A3161B;text-decoration:none;font-weight:bold">${text}</a>`;
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(SITE.name)}</title></head>
<body style="margin:0;padding:0;background:#F4EEE6">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4EEE6;padding:24px 12px;font-family:Poppins,Segoe UI,Arial,sans-serif;color:#22140F">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(107,13,17,.08)">
    <tr><td style="background:#A3161B;background-image:linear-gradient(135deg,#C4262C,#A3161B 55%,#6B0D11);padding:28px 24px;text-align:center">
      <img src="${logo}" width="76" height="76" alt="Chixee" style="display:block;margin:0 auto 10px;border-radius:50%;border:3px solid #FFC20E;background:#ffffff">
      <div style="font-size:26px;font-weight:900;letter-spacing:2px;color:#FFC20E">CHIXEE</div>
      <div style="font-size:14px;font-style:italic;color:#ffffff;opacity:.9">${esc(SITE.tagline)}</div>
    </td></tr>
    <tr><td style="height:6px;background:#FFC20E;font-size:0;line-height:0">&nbsp;</td></tr>
    <tr><td style="padding:32px 28px 8px;font-size:15px;line-height:1.6">${body}</td></tr>
    <tr><td style="padding:8px 28px 28px;font-size:15px;line-height:1.6">Stay hungry,<br><b>Team Chixee</b></td></tr>
    <tr><td style="background:#22140F;color:#E9DED6;padding:22px 24px;text-align:center;font-size:13px;line-height:1.7">
      <div style="color:#FFC20E;font-weight:bold;font-size:15px;margin-bottom:4px">${esc(SITE.name)}</div>
      ${esc(SITE.branch.address)}<br>
      UAN <a href="tel:${SITE.uan.replace(/\D/g, "")}" style="color:#FFC20E;text-decoration:none">${SITE.uan}</a>
      &nbsp;·&nbsp; WhatsApp <a href="${wa}" style="color:#FFC20E;text-decoration:none">${SITE.phone}</a><br>
      <a href="${SITE.facebook}" style="color:#E9DED6">Facebook</a> &nbsp;·&nbsp;
      <a href="${SITE.instagram}" style="color:#E9DED6">Instagram</a> &nbsp;·&nbsp;
      <a href="${SITE.tiktok}" style="color:#E9DED6">TikTok</a> &nbsp;·&nbsp;
      <a href="${origin}" style="color:#E9DED6">Order online</a>
    </td></tr>
  </table>
  <p style="max-width:560px;margin:14px auto 0;font-size:11px;color:#9A8A80;text-align:center;font-family:Arial,sans-serif">
    You got this email because a request was made on ${link(origin, esc(new URL(origin).host))}. ${esc(SITE.name)} · ${esc(SITE.company)}, ${esc(SITE.city)}.
  </p>
</td></tr></table>
</body></html>`;
}

export async function sendResetEmail(to, name, link) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Development fallback: no key configured, print the link to the server console.
    console.log(`[reset-password] RESEND_API_KEY missing. Reset link for ${to}: ${link}`);
    return;
  }
  const origin = new URL(link).origin;
  const hi = esc(firstName(name));
  const body = `
    <h1 style="margin:0 0 14px;font-size:24px;color:#A3161B">Reset your password</h1>
    <p style="margin:0 0 12px">Hi ${hi},</p>
    <p style="margin:0 0 22px">We got a request to reset the password for your Chixee account. Tap the button below to choose a new one. The link works for <b>30 minutes</b>.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 22px"><tr><td style="border-radius:12px;background:#FFC20E">
      <a href="${link}" style="display:inline-block;padding:14px 28px;font-weight:bold;font-size:16px;color:#6B0D11;text-decoration:none">Choose a new password</a>
    </td></tr></table>
    <p style="margin:0 0 6px;font-size:13px;color:#7A6A62">Button not working? Copy this link into your browser:</p>
    <p style="margin:0 0 20px;font-size:12px;word-break:break-all"><a href="${link}" style="color:#A3161B">${esc(link)}</a></p>
    <div style="padding:12px 14px;border-radius:12px;background:#FFF6D6;font-size:13px;color:#6B0D11">
      Didn't ask for this? You can ignore this email and your password stays the same. Need help? WhatsApp us on <b>${SITE.phone}</b>.
    </div>`;
  const text = `Hi ${firstName(name)},

We got a request to reset the password for your Chixee account. Open this link to choose a new one (it works for 30 minutes):
${link}

Didn't ask for this? Ignore this email and your password stays the same.

Team Chixee
UAN ${SITE.uan} · WhatsApp ${SITE.phone}
${SITE.branch.address}`;

  const resend = new Resend(key);
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Chixee <onboarding@resend.dev>",
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
    to,
    subject: "Reset your Chixee password",
    html: layout({ origin, preheader: "Your password reset link (valid for 30 minutes)", body }),
    text,
    attachments: [{ filename: "chixee-logo.png", content: Buffer.from(EMAIL_LOGO_PNG_BASE64, "base64"), contentType: "image/png", contentId: "chixee-logo" }],
  });
}
