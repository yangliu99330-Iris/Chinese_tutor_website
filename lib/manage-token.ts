import { createHmac } from "crypto";

// HMAC'd from the Stripe session id + slot date/time so the token is
// deterministic (no DB round-trip needed to build email links) yet
// unguessable without the server-only secret. Reuses STRIPE_WEBHOOK_SECRET
// since it's already a strong, private secret present in every environment.
function secretKey(): string {
  return process.env.STRIPE_WEBHOOK_SECRET ?? "dev-only-insecure-secret";
}

export function manageTokenFor(sessionId: string, date: string, time: string): string {
  return createHmac("sha256", secretKey())
    .update(`${sessionId}:${date}:${time}`)
    .digest("hex")
    .slice(0, 32);
}

export const SITE_URL = process.env.SITE_URL ?? "https://www.chinesetutoryang.com";

export function manageUrlFor(token: string): string {
  return `${SITE_URL}/manage/${token}`;
}
