-- Run this once in the Vercel Postgres dashboard's Query editor (Storage tab)
-- to create the tables the booking system needs.

-- One row per booked lesson slot. A single Stripe checkout session can cover
-- several slots (recurring bookings), so the session id alone isn't unique --
-- the (session, date, time) triple is what prevents duplicate rows if the
-- webhook is retried.
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  stripe_session_id TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS blocked_slots (
  id SERIAL PRIMARY KEY,
  blocked_date DATE NOT NULL,
  blocked_time TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots (blocked_date);
