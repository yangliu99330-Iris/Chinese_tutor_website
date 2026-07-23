export const ADMIN_COOKIE_NAME = "admin_session";

/**
 * Derived token stored in the session cookie — never the raw password itself.
 * Uses Web Crypto (not Node's `crypto` module) so it also works in the
 * Edge Runtime that middleware.ts runs in.
 */
export async function getExpectedSessionToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;

  const data = new TextEncoder().encode(`${password}:admin-session`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
