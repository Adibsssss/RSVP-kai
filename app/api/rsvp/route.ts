import { NextRequest, NextResponse } from "next/server";
import { appendRsvp, listRsvps, SheetsApiError } from "@/lib/google-sheets";
import type { ApiErrorBody, RsvpSubmission } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validate(body: unknown): { ok: true; value: RsvpSubmission } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request." };
  }
  const { name, attending, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim() === "") {
    return { ok: false, error: "Please enter your name." };
  }
  if (attending !== "yes" && attending !== "no") {
    return { ok: false, error: "Please let us know if you can attend." };
  }
  if (typeof message !== "string") {
    return { ok: false, error: "Invalid request." };
  }

  return {
    ok: true,
    value: {
      name: name.trim().slice(0, 200),
      attending,
      message: message.trim().slice(0, 1000),
    },
  };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ApiErrorBody>({ error: "Invalid request." }, { status: 400 });
  }

  const validated = validate(body);
  if (!validated.ok) {
    return NextResponse.json<ApiErrorBody>({ error: validated.error }, { status: 400 });
  }

  try {
    await appendRsvp(validated.value);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof SheetsApiError) {
      console.error("rsvp save Sheets error:", err.message, err.detail);
    } else {
      console.error("rsvp save unexpected error:", err);
    }
    return NextResponse.json<ApiErrorBody>(
      { error: "Could not save your RSVP. Please try again." },
      { status: 502 },
    );
  }
}

export async function GET() {
  try {
    const entries = await listRsvps();
    return NextResponse.json({ entries }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof SheetsApiError) {
      console.error("rsvp list Sheets error:", err.message, err.detail);
    } else {
      console.error("rsvp list unexpected error:", err);
    }
    return NextResponse.json<ApiErrorBody>({ error: "Could not load RSVPs." }, { status: 502 });
  }
}
