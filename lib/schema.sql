-- Run this once in the Vercel Postgres dashboard's Query editor (Storage tab)
-- to create the tables the booking system needs.

-- One row per booked lesson slot. A single Stripe checkout session can cover
-- several slots (recurring bookings), so the session id alone isn't unique --
-- the (session, date, time) triple is what prevents duplicate rows if the
-- webhook is retried.
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  stripe_session_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  manage_token TEXT,
  lesson_type TEXT NOT NULL,
  lesson_date DATE NOT NULL,
  lesson_time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  notes TEXT,
  amount_paid_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (stripe_session_id, lesson_date, lesson_time)
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (lesson_date);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent ON bookings (stripe_payment_intent_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_manage_token ON bookings (manage_token);

-- Run these two ALTERs (one at a time) if the `bookings` table already exists
-- from before the cancel/reschedule/refund feature was added:
-- ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
-- ALTER TABLE bookings ADD COLUMN IF NOT EXISTS manage_token TEXT;
-- CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent ON bookings (stripe_payment_intent_id);
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_manage_token ON bookings (manage_token);

CREATE TABLE IF NOT EXISTS blocked_slots (
  id SERIAL PRIMARY KEY,
  blocked_date DATE NOT NULL,
  blocked_time TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots (blocked_date);

-- Marks a Stripe checkout session as "confirmation emails sent" so retried
-- or manually resent webhook deliveries never send duplicate emails.
-- See lib/send-email.ts.
CREATE TABLE IF NOT EXISTS booking_emails (
  stripe_session_id TEXT PRIMARY KEY,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
