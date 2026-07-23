import { NextRequest, NextResponse } from "next/server";
import { blockSlot, unblockSlot } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { date, time, reason } = await req.json();
  if (!date) {
    return NextResponse.json({ error: "Missing date." }, { status: 400 });
  }
  await blockSlot(date, time ?? null, reason ?? "");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  await unblockSlot(id);
  return NextResponse.json({ ok: true });
}
