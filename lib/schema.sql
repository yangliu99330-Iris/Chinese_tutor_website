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
  customer_timezone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (stripe_session_id, lesson_date, lesson_time)
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (lesson_date);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent ON bookings (stripe_payment_intent_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_manage_token ON bookings (manage_token);

-- Run these ALTERs (one at a time) if the `bookings` table already exists
-- from before the cancel/reschedule/refund feature was added:
-- ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
-- ALTER TABLE bookings ADD COLUMN IF NOT EXISTS manage_token TEXT;
-- CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent ON bookings (stripe_payment_intent_id);
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_manage_token ON bookings (manage_token);
-- ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_timezone TEXT;

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

-- The tutor's actual bookable hours, set via "Set availability" in /admin
-- (see lib/db.ts#getAvailabilityWindows). A row is either a recurring weekly
-- window (weekday set, specific_date null) or a one-off window on a single
-- date (specific_date set, weekday null) -- never both. There is no default:
-- nothing is bookable until at least one window exists.
CREATE TABLE IF NOT EXISTS availability_windows (
  id SERIAL PRIMARY KEY,
  weekday INTEGER,       -- 0 (Sun) .. 6 (Sat); null for a one-off window
  specific_date DATE,    -- set only for a one-off window
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (weekday IS NOT NULL AND specific_date IS NULL) OR
    (weekday IS NULL AND specific_date IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_availability_windows_weekday ON availability_windows (weekday);
CREATE INDEX IF NOT EXISTS idx_availability_windows_date ON availability_windows (specific_date);

-- If the `bookings`/`blocked_slots` tables already exist from before this
-- feature, run the CREATE TABLE + indexes above for availability_windows,
-- then seed it with the site's old flat "every day 9:00-18:00" default so
-- public booking doesn't go blank the moment this deploys -- the tutor can
-- then edit/narrow it down to her real hours from the admin calendar:
-- INSERT INTO availability_windows (weekday, start_time, end_time)
--   SELECT d, '09:00', '18:00' FROM generate_series(0, 6) AS d;
