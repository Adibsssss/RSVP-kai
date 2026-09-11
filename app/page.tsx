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
    <main className="animate-reveal-up relative min-h-screen overflow-hidden pb-24">
      <div className="balloon balloon-home-one" aria-hidden />
      <div className="balloon balloon-home-two" aria-hidden />
      <div className="balloon balloon-home-three" aria-hidden />
      <div className="balloon balloon-home-four" aria-hidden />
      <div className="balloon balloon-confetti" aria-hidden />
      <div className="balloon balloon-stripe" aria-hidden />
      <div className="graffiti graffiti-home" aria-hidden>
        YAY!
      </div>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-2xl px-6 pt-16 text-center sm:pt-24">
        <div className="polaroid-frame relative mx-auto w-[72%] max-w-[260px] -rotate-2 rounded-sm">
          <div className="aspect-square w-full overflow-hidden rounded-[2px] bg-line/40">
            <img
              src="/kai-hero.jpg"
              alt="Kai"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.34em] text-cornflower">
          Together with joy, we invite you
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[1.03] tracking-tight text-ink sm:text-6xl">
          YOU ARE
          <br />
          INVITED
        </h1>
        <div className="flourish-divider mx-auto mt-5" aria-hidden />
        <p className="mx-auto mt-5 max-w-sm text-[17px] font-semibold text-ink/80">
          {eventConfig.title}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
          We&rsquo;d love for you to join us as we celebrate{" "}
          {eventConfig.childName}
          &rsquo;s birthday and dedication.
        </p>
      </section>

      {/* Event details */}
      <section className="relative z-10 mx-auto mt-12 max-w-2xl px-6">
        <div className="balloon decor-behind balloon-details-one" aria-hidden />
        <div className="balloon decor-behind balloon-details-two" aria-hidden />
        <div className="graffiti decor-behind graffiti-details" aria-hidden>
          POP!
        </div>
        <div className="grand-card rounded-3xl p-7 sm:p-9">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cornflower">
            Event details
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-muted">
                Date
              </dt>
              <dd className="mt-1 font-display text-lg text-ink">
                {eventConfig.dateLabel}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-muted">
                Time
              </dt>
              <dd className="mt-1 font-display text-lg text-ink">
                {eventConfig.timeLabel}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[11px] font-bold uppercase tracking-widest text-muted">
                Venue
              </dt>
              <dd className="mt-1 font-display text-lg text-ink">
                {eventConfig.venueName}
                <br />
                <span className="font-sans text-[14px] font-normal text-muted">
                  {eventConfig.venueAddress}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Map */}
      <section className="relative z-10 mx-auto mt-6 max-w-2xl px-6">
        <div className="balloon decor-behind balloon-map-one" aria-hidden />
        <div className="grand-card rounded-3xl p-5 sm:p-7">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-cornflower">
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
        <div
          className="balloon decor-behind balloon-countdown-one"
          aria-hidden
        />
        <div
          className="balloon decor-behind balloon-countdown-two"
          aria-hidden
        />
        <div className="graffiti decor-behind graffiti-countdown" aria-hidden>
          TICK TOCK
        </div>
        <div className="grand-card rounded-3xl p-7 sm:p-9">
          <Countdown targetISO={eventConfig.startsAtISO} />
        </div>
      </section>

      {/* RSVP */}
      <section className="relative z-10 mx-auto mt-12 max-w-2xl px-6 text-center">
        <div className="balloon decor-behind balloon-rsvp-one" aria-hidden />
        <div className="balloon decor-behind balloon-rsvp-two" aria-hidden />
        <div className="graffiti decor-behind graffiti-rsvp" aria-hidden>
          SEE YOU!
        </div>
        <div className="flourish-divider mx-auto mb-8" aria-hidden />
        <Link
          href="/rsvp"
          className="inline-block rounded-full bg-cornflower px-10 py-5 text-[16px] font-bold tracking-wide text-white shadow-[0_16px_36px_rgba(61,132,196,0.5)] transition active:scale-[0.98]"
        >
          RSVP Here
        </Link>
      </section>
    </main>
  );
}
