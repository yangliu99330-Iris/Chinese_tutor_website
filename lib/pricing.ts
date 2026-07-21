export type LessonTypeId = "private" | "trial" | "young-pupils" | "group" | "dance";

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
    id: "trial",
    label: "Trial Lesson",
    priceCents: 1299,
    durationMinutes: 30,
    description: "A 30-minute introductory lesson — a low-commitment way to get started.",
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
