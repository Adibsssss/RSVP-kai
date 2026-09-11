"use client";

import { useState } from "react";

interface EnvelopeProps {
  onOpened: () => void;
}

/**
 * The opening screen: title, then the envelope photo (closed → open),
 * triggered by tapping the wax seal. Deliberately simple — a single
 * crossfade between the two reference photos, then the parent swaps in
 * the invitation itself.
 */
export function Envelope({ onOpened }: EnvelopeProps) {
  const [opening, setOpening] = useState(false);

  function handleOpen() {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpened, 650);
  }

  return (
    <div className="envelope-scene fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="balloon balloon-blue" aria-hidden />
      <div className="balloon balloon-cloud" aria-hidden />
      <div className="balloon balloon-sky" aria-hidden />
      <div className="graffiti graffiti-kai" aria-hidden>
        KAI!
      </div>

      <div
        className={`relative z-10 text-center transition-opacity duration-500 ${
          opening ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cornflower">
          You&rsquo;re invited to
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight text-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] sm:text-4xl">
          Kai&rsquo;s Birthday &amp; Dedication
        </h1>
      </div>

      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open invitation"
        className="group relative z-10 mt-9 w-full max-w-sm"
      >
        <div className="relative aspect-[697/397] w-full overflow-hidden rounded-xl shadow-[0_20px_34px_rgba(23,50,89,0.28)] transition-transform duration-300 group-hover:-translate-y-1">
          {/* Closed envelope */}
          <img
            src="/envelope-closed.jpg"
            alt="Closed envelope with a wax seal"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out ${
              opening ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          />
          {/* Open envelope */}
          <img
            src="/envelope-open.jpg"
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out ${
              opening ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          />
          {/* Tap cue centered on the seal */}
          {!opening && (
            <span
              className="animate-seal-idle pointer-events-none absolute left-1/2 top-[58%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white/40"
              aria-hidden
            />
          )}
        </div>
      </button>

      <p
        className={`relative z-10 mt-8 rounded-full bg-white/70 px-4 py-2 text-[13px] font-medium text-ink/80 shadow-sm backdrop-blur-sm transition-opacity duration-300 ${
          opening ? "opacity-0" : "opacity-100"
        }`}
      >
        Tap the wax seal to open
      </p>
    </div>
  );
}
