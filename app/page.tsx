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
    <main className="animate-reveal-up relative min-h-screen overflow-hidden pb-20">
      <div className="balloon balloon-home-one" aria-hidden />
      <div className="balloon balloon-home-two" aria-hidden />
      <div className="balloon balloon-home-three" aria-hidden />
      <div className="balloon balloon-home-four" aria-hidden />
      <div className="graffiti graffiti-home" aria-hidden>
        YAY!
      </div>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-2xl px-6 pt-14 text-center sm:pt-20">
        <div className="polaroid-frame relative mx-auto w-[62%] max-w-[220px] -rotate-2 rounded-sm">
          <div className="aspect-square w-full overflow-hidden rounded-[2px] bg-line/40">
            <img
              src="/kai-hero.jpg"
              alt="Kai"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.3em] text-cornflower">
          Together with joy, we invite you
        </p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
          YOU ARE INVITED
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[16px] font-semibold text-ink/80">
          {eventConfig.title}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
          We&rsquo;d love for you to join us as we celebrate{" "}
          {eventConfig.childName}
          &rsquo;s birthday and dedication.
        </p>
      </section>

      {/* Event details */}
      <section className="relative z-10 mx-auto mt-10 max-w-2xl px-6">
        <div className="rounded-3xl border border-line bg-white/75 p-6 shadow-[0_10px_28px_rgba(23,50,89,0.1)] backdrop-blur-sm sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-cornflower">
            Event details
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-5 text-left sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-muted">
                Date
              </dt>
              <dd className="mt-1 text-[15px] text-ink">
                {eventConfig.dateLabel}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-muted">
                Time
              </dt>
              <dd className="mt-1 text-[15px] text-ink">
                {eventConfig.timeLabel}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[11px] font-bold uppercase tracking-widest text-muted">
                Venue
              </dt>
              <dd className="mt-1 text-[15px] text-ink">
                {eventConfig.venueName}
                <br />
                <span className="text-muted">{eventConfig.venueAddress}</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Map */}
      <section className="relative z-10 mx-auto mt-6 max-w-2xl px-6">
        <div className="rounded-3xl border border-line bg-white/75 p-4 shadow-[0_10px_28px_rgba(23,50,89,0.1)] backdrop-blur-sm sm:p-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-cornflower">
            Find us here
          </p>
          <MapEmbed
            src={eventConfig.mapEmbedSrc}
            title={`Map to ${eventConfig.venueName}`}
          />
        </div>
      </section>

      {/* Countdown */}
      <section className="relative z-10 mx-auto mt-6 max-w-2xl px-6">
        <div className="rounded-3xl border border-line bg-white/75 p-6 shadow-[0_10px_28px_rgba(23,50,89,0.1)] backdrop-blur-sm sm:p-8">
          <Countdown targetISO={eventConfig.startsAtISO} />
        </div>
      </section>

      {/* RSVP */}
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
