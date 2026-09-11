"use client";

import { useState } from "react";

interface EnvelopeProps {
  onOpened: () => void;
}

/**
 * The opening screen: crest, title, flourish, then the envelope photo
 * (closed → open). Tapping the wax seal swaps straight to the open
 * envelope and hands off to the parent — no crossfade, scale, or delay.
 */
export function Envelope({ onOpened }: EnvelopeProps) {
  const [opened, setOpened] = useState(false);

  function handleOpen() {
    if (opened) return;
    setOpened(true);
    onOpened();
  }

  return (
    <div className="envelope-scene fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="balloon balloon-blue" aria-hidden />
      <div className="balloon balloon-cloud" aria-hidden />
      <div className="balloon balloon-sky" aria-hidden />
      <div className="graffiti graffiti-kai" aria-hidden>
        KAI!
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-cornflower">
          You&rsquo;re invited to
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] sm:text-5xl">
          Kai&rsquo;s Birthday
          <br />
          <span className="text-cornflower">&amp; Dedication</span>
        </h1>
        <div className="flourish-divider mt-5" aria-hidden />
      </div>

      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open invitation"
        className="group relative z-10 mt-9 w-full max-w-md"
      >
        <div className="envelope-frame relative aspect-[697/397] w-full overflow-hidden rounded-2xl">
          <img
            src={opened ? "/envelope-open.jpg" : "/envelope-closed.jpg"}
            alt={opened ? "" : "Closed envelope with a wax seal"}
            aria-hidden={opened || undefined}
            className="absolute inset-0 h-full w-full scale-[1.12] object-cover object-center"
          />
          {!opened && (
            <span
              className="pointer-events-none absolute left-1/2 top-[58%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white/60"
              aria-hidden
            />
          )}
        </div>
      </button>

      <p className="relative z-10 mt-8 rounded-full bg-white/70 px-5 py-2.5 text-[13px] font-medium tracking-wide text-ink/80 shadow-sm backdrop-blur-sm">
        Tap the wax seal to open
      </p>
    </div>
  );
}
