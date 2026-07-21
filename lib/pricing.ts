export type LessonTypeId = "chinese-language" | "chinese-dance";

export interface LessonType {
  id: LessonTypeId;
  label: string;
  priceCents: number;
  durationMinutes: number;
}

// Edit prices/durations here to match the Pricing page.
export const LESSON_TYPES: LessonType[] = [
  {
    id: "chinese-language",
    label: "Chinese Language Lesson",
    priceCents: 6500,
    durationMinutes: 60,
  },
  {
    id: "chinese-dance",
    label: "Chinese Dance Lesson",
    priceCents: 5500,
    durationMinutes: 60,
  },
];

export function getLessonType(id: LessonTypeId): LessonType {
  const lesson = LESSON_TYPES.find((l) => l.id === id);
  if (!lesson) throw new Error(`Unknown lesson type: ${id}`);
  return lesson;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
