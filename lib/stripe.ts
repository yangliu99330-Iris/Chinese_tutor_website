import Stripe from "stripe";

let stripeClient: Stripe | null = null;

// Constructed lazily so a missing STRIPE_SECRET_KEY only breaks requests
// that actually need Stripe, not the whole Next.js build.
export function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}
