"use client";

import { useState } from "react";
import Link from "next/link";
import { Envelope } from "@/components/Envelope";
import { Countdown } from "@/components/Countdown";
import { MapEmbed } from "@/components/MapEmbed";
import { eventConfig } from "@/lib/config";

export default function Page() {
  const [opened, setOpened] = useState(false);

  if (!opened) {
    return <Envelope onOpened={() => setOpened(true)} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden pb-20">
      <div className="balloon balloon-home-one" aria-hidden />
      <div className="balloon balloon-home-two" aria-hidden />
      <div className="balloon balloon-home-three" aria-hidden />
      <div className="balloon balloon-home-four" aria-hidden />
      <div className="graffiti graffiti-home" aria-hidden>YAY!</div>
      <section className="animate-float-in relative z-10 mx-auto max-w-2xl px-6 pt-14 text-center sm:pt-20">
        <div className="polaroid-frame relative mx-auto w-[62%] max-w-[220px] -rotate-2 rounded-sm">
          <div className="aspect-square w-full overflow-hidden rounded-[2px] bg-line/40">
            <img src="/kai-hero.jpg" alt="Kai" className="h-full w-full object-cover" />
          </div>
        </div>

        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-cornflower">
          You&rsquo;re invited
        </p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
          {eventConfig.title}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
          We&rsquo;d love for you to join us as we celebrate {eventConfig.childName}
          &rsquo;s birthday and dedication.
        </p>
      </section>

      <section className="relative z-10 mx-auto mt-12 max-w-2xl px-6">
        <div className="rounded-3xl border border-line bg-white/70 p-6 shadow-[0_10px_28px_rgba(23,50,89,0.1)] sm:p-8">
          <dl className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-cornflower">Date</dt>
              <dd className="mt-1 text-[15px] text-ink">{eventConfig.dateLabel}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-cornflower">Time</dt>
              <dd className="mt-1 text-[15px] text-ink">{eventConfig.timeLabel}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[11px] font-bold uppercase tracking-widest text-cornflower">Venue</dt>
              <dd className="mt-1 text-[15px] text-ink">
                {eventConfig.venueName}
                <br />
                <span className="text-muted">{eventConfig.venueAddress}</span>
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <MapEmbed src={eventConfig.mapEmbedSrc} title={`Map to ${eventConfig.venueName}`} />
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <Countdown targetISO={eventConfig.startsAtISO} />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-10 max-w-2xl px-6 text-center">
        <Link
          href="/rsvp"
          className="inline-block rounded-full bg-cornflower px-8 py-4 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(61,132,196,0.4)] transition active:scale-[0.98]"
        >
          RSVP Here
        </Link>
      </section>
    </main>
  );
}
