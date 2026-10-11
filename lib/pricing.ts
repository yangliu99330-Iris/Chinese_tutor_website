export type LessonTypeId = "private" | "express" | "trial" | "young-pupils" | "group" | "dance";

export interface LessonType {
  id: LessonTypeId;
  label: string;
  priceCents: number;
  durationMinutes: number;
  description: string;
}

// Mirrors the live lesson types/prices at chinesetutoryang.as.me. Prices are
// in GBP pence. Update here (and keep the Acuity page in sync) if rates change.
export const LESSON_TYPES: LessonType[] = [
  {
    id: "private",
    label: "One to One Private Chinese Lesson",
    priceCents: 2199,
    durationMinutes: 60,
    description: "A focused 60-minute one-on-one Mandarin lesson tailored to your goals.",
  },
  {
    id: "express",
    label: "Express Lesson",
    priceCents: 1299,
    durationMinutes: 30,
    description: "A focused 30-minute one-on-one lesson — ideal for a quick practice session or a tight schedule.",
  },
  {
    id: "trial",
    label: "Trial Lesson",
    priceCents: 1099,
    durationMinutes: 30,
    description: "For new students: a 30-minute introductory first lesson — a low-commitment way to get started.",
  },
  {
    id: "young-pupils",
    label: "Lesson for Young Pupils",
    priceCents: 1899,
    durationMinutes: 45,
    description: "A 45-minute lesson paced and structured for younger learners.",
  },
  {
    id: "group",
    label: "Group Lesson (2-5 people)",
    priceCents: 4999,
    durationMinutes: 90,
    description: "Invite your language partner — a 90-minute lesson for 2-5 people.",
  },
  {
    id: "dance",
    label: "Chinese Dance Lesson",
    priceCents: 2900,
    durationMinutes: 45,
    description: "Including Chinese Classical Dance, Chinese Folk Dance, Ballet, or Modern Dance.",
  },
];

export function getLessonType(id: LessonTypeId): LessonType {
  const lesson = LESSON_TYPES.find((l) => l.id === id);
  if (!lesson) throw new Error(`Unknown lesson type: ${id}`);
  return lesson;
}

export function formatPrice(cents: number): string {
  return `£${(cents / 100).toFixed(2)}`;
}

/** Booking this many lessons (of the same type) in a single order earns BULK_DISCOUNT_PERCENT off every lesson. */
export const BULK_DISCOUNT_MIN_LESSONS = 10;
export const BULK_DISCOUNT_PERCENT = 5;

export interface OrderPricing {
  lessonCount: number;
  /** Price charged per lesson after any discount (this is the Stripe unit_amount). */
  unitCents: number;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  discountPercent: number;
  /** How many more lessons would unlock the discount (0 once earned, or for an empty order). */
  lessonsToDiscount: number;
}

/**
 * Single source of truth for what an order costs — used by the booking UI and
 * by the checkout route, so the price shown always equals the price charged.
 * The discount is applied per lesson (rounded to the penny) so that
 * unit price × quantity is exactly the total Stripe charges.
 */
export function calculateOrderPricing(listPriceCents: number, lessonCount: number): OrderPricing {
  const qualifies = lessonCount >= BULK_DISCOUNT_MIN_LESSONS;
  const unitCents = qualifies
    ? Math.round((listPriceCents * (100 - BULK_DISCOUNT_PERCENT)) / 100)
    : listPriceCents;
  const subtotalCents = listPriceCents * lessonCount;
  const totalCents = unitCents * lessonCount;

  return {
    lessonCount,
    unitCents,
    subtotalCents,
    discountCents: subtotalCents - totalCents,
    totalCents,
    discountPercent: qualifies ? BULK_DISCOUNT_PERCENT : 0,
    lessonsToDiscount:
      lessonCount > 0 && !qualifies ? BULK_DISCOUNT_MIN_LESSONS - lessonCount : 0,
  };
}
