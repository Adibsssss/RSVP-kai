"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { eventConfig } from "@/lib/config";
import type { Attending } from "@/types";

export default function RsvpPage() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<Attending | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!attending) {
      setErrorMessage("Please let us know if you can attend.");
      return;
    }
    setStatus("saving");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attending, message }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Could not save your RSVP.");
      }
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Could not save your RSVP.",
      );
    }
  }

  return (
    <main className="min-h-screen px-6 py-14">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-[13px] font-medium text-cornflower">
          &larr; Back to invitation
        </Link>

        <h1 className="mt-4 font-display text-3xl text-ink">Wedding RSVP</h1>
        <p className="mt-1 text-[14px] text-muted">
          Kindly respond by the day before the event.
        </p>

        {status === "saved" ? (
          <div className="mt-8 rounded-2xl border border-line bg-white/70 p-6 text-center">
            <p className="font-display text-xl text-ink">Response saved</p>
            <p className="mt-2 text-[14px] text-muted">
              {attending === "yes" ? (
                <>
                  Thank you, {name}! We can&rsquo;t wait to celebrate with you.
                </>
              ) : (
                <>
                  Thank you, {name}! We&rsquo;re sorry you can&rsquo;t make it,
                  but we appreciate you letting us know.
                </>
              )}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 rounded-2xl border border-line bg-white/70 p-6"
          >
            <div>
              <label htmlFor="name" className="text-[13px] font-bold text-ink">
                Your name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] text-ink outline-none focus:border-cornflower"
                placeholder="Juan Dela Cruz"
              />
            </div>

            <div>
              <p className="text-[13px] font-bold text-ink">Can you attend?</p>
              <div className="mt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setAttending("yes")}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-[14px] font-medium transition ${
                    attending === "yes"
                      ? "border-cornflower bg-baby text-ink"
                      : "border-line bg-white text-muted"
                  }`}
                >
                  Absolutely, wouldn&rsquo;t miss it!
                </button>
                <button
                  type="button"
                  onClick={() => setAttending("no")}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-[14px] font-medium transition ${
                    attending === "no"
                      ? "border-cornflower bg-baby text-ink"
                      : "border-line bg-white text-muted"
                  }`}
                >
                  Can&rsquo;t make it this time.
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-[13px] font-bold text-ink"
              >
                Questions or a message (optional)
              </label>
              {eventConfig.contacts.length > 0 && (
                <p className="mt-1 text-[12px] text-muted">
                  {eventConfig.contacts
                    .map((c) => `${c.label}: ${c.number}`)
                    .join(" · ")}
                </p>
              )}
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] text-ink outline-none focus:border-cornflower"
              />
            </div>

            {errorMessage && (
              <p className="text-[13px] text-red-600">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === "saving"}
              className="w-full rounded-full bg-cornflower py-3.5 text-[15px] font-bold text-white transition active:scale-[0.98] disabled:opacity-60"
            >
              {status === "saving" ? "Saving…" : "Submit RSVP"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
