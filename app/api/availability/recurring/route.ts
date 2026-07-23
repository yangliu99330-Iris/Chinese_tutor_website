import { NextRequest, NextResponse } from "next/server";
import { getExcludedSlots } from "@/lib/db";
import { buildRecurringSlots, parseDateKey, RecurrenceFrequency, toDateKey } from "@/lib/availability";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, time, frequency, occurrences, duration } = body as {
    date: string;
    time: string;
    frequency: RecurrenceFrequency;
    occurrences: number;
    duration: number;
  };

  if (!date || !time || !frequency || !occurrences || !duration) {
    return NextResponse.json({ error: "Missing params." }, { status: 400 });
  }

  const startDate = parseDateKey(date);
  const lastDate = new Date(startDate);
  const span = occurrences - 1;
  if (frequency === "weekly") lastDate.setDate(lastDate.getDate() + 7 * span);
  else if (frequency === "biweekly") lastDate.setDate(lastDate.getDate() + 14 * span);
  else lastDate.setMonth(lastDate.getMonth() + span);

  const excluded = await getExcludedSlots(toDateKey(startDate), toDateKey(lastDate));

  const result = buildRecurringSlots(
    { date, time },
    frequency,
    occurrences,
    duration,
    excluded
  );

  return NextResponse.json(result);
}
