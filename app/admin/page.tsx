"use client";

import { useEffect, useState } from "react";
import type { RsvpEntry } from "@/types";

export default function AdminPage() {
  const [entries, setEntries] = useState<RsvpEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rsvp", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load RSVPs.");
        return res.json() as Promise<{ entries: RsvpEntry[] }>;
      })
      .then((data) => setEntries(data.entries))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load RSVPs."),
      );
  }, []);

  const attending = entries?.filter((e) => e.attending === "yes").length ?? 0;
  const notAttending = entries?.filter((e) => e.attending === "no").length ?? 0;
  const totalGuests =
    entries?.reduce((sum, e) => sum + (e.guestCount || 0), 0) ?? 0;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl text-ink">RSVP Responses</h1>

        {error && <p className="mt-4 text-[14px] text-red-600">{error}</p>}

        {entries && (
          <div className="mt-4 flex flex-wrap gap-4 text-[14px]">
            <span className="rounded-full bg-baby px-3 py-1 font-medium text-ink">
              {attending} attending
            </span>
            <span className="rounded-full bg-line px-3 py-1 font-medium text-muted">
              {notAttending} not attending
            </span>
            <span className="rounded-full bg-line px-3 py-1 font-medium text-muted">
              {entries.length} total
            </span>
            <span className="rounded-full bg-cornflower px-3 py-1 font-medium text-white">
              {totalGuests} total guests
            </span>
          </div>
        )}

        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white/70">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-line text-[12px] uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Attending</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {entries === null && !error && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted">
                    Loading…
                  </td>
                </tr>
              )}
              {entries?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted">
                    No responses yet.
                  </td>
                </tr>
              )}
              {entries?.map((entry, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-muted">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-ink">{entry.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        entry.attending === "yes"
                          ? "font-medium text-cornflower"
                          : "text-muted"
                      }
                    >
                      {entry.attending === "yes"
                        ? "Attending"
                        : "Not attending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {entry.attending === "yes" ? entry.guestCount : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {entry.message || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
