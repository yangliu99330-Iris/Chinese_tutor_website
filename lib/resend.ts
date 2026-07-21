import { Resend } from "resend";

let resendClient: Resend | null = null;

// Constructed lazily so a missing RESEND_API_KEY only breaks requests
// that actually need to send email, not the whole Next.js build.
export function getResend(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export const BOOKING_FROM_EMAIL = "Chinese Tutor Yang <booking@chinesetutoryang.com>";
export const TUTOR_NOTIFY_EMAIL = "chinesetutoryang@gmail.com";
