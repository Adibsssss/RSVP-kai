"use client";

import { useState } from "react";

interface EnvelopeProps {
  onOpened: () => void;
}

/**
 * A CSS-only envelope: a rectangle "body" with a triangular "flap" on top
 * (clip-path) and a circular wax seal centered on the seam. Clicking the
 * seal rotates the flap open around its top edge and fades the seal away;
 * once that animation finishes, onOpened() tells the parent to swap in the
 * invitation itself.
 */
export function Envelope({ onOpened }: EnvelopeProps) {
  const [opening, setOpening] = useState(false);

  function handleOpen() {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpened, 720);
  }

  return (
    <div className="envelope-scene fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="balloon balloon-blue" aria-hidden />
      <div className="balloon balloon-cloud" aria-hidden />
      <div className="balloon balloon-sky" aria-hidden />
      <div className="balloon balloon-confetti" aria-hidden />
      <div className="balloon balloon-stripe" aria-hidden />
      <div className="graffiti graffiti-kai" aria-hidden>KAI!</div>
      <div className="graffiti graffiti-party" aria-hidden>PARTY TIME</div>
      <div className="relative z-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cornflower">A special delivery</p>
        <p className="mt-2 font-display text-3xl text-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] sm:text-4xl">
          You&rsquo;re invited to Kai&rsquo;s celebration
        </p>
      </div>

      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open invitation"
        className="group relative z-10 mt-9 w-full max-w-sm focus-visible:rounded-lg"
        style={{ perspective: "1200px" }}
      >
        <div className="relative aspect-[4/3] w-full drop-shadow-[0_24px_26px_rgba(23,50,89,0.24)]">
          {/* Envelope body */}
          <div className="envelope-body absolute inset-0 rounded-[5px]" />
          <img
            src="/envelope-refernce.png"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full rounded-[5px] object-cover opacity-35 mix-blend-screen"
          />
          <div className="envelope-rim absolute inset-[7px] rounded-[2px]" aria-hidden />
          {/* A real card peeking out above the closed envelope. */}
          <div
            className={`absolute inset-x-[12%] top-[-13%] h-[60%] rounded-sm bg-[#fffdf9] shadow-[0_-1px_0_rgba(255,255,255,.8),0_4px_10px_rgba(0,0,0,.28)] transition-all duration-500 ease-out ${
              opening ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="absolute inset-2 border border-cornflower/20" />
          </div>

          {/* Bottom triangular fold of the envelope, always visible */}
          <div
            className="absolute inset-0 bg-[#10252d]/75"
            style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 45%)" }}
          />
          <div
            className="absolute inset-0 bg-[#284852]/85"
            style={{ clipPath: "polygon(0 100%, 0 0, 50% 45%)" }}
          />
          <div
            className="absolute inset-0 bg-[#203f48]/90"
            style={{ clipPath: "polygon(100% 100%, 100% 0, 50% 45%)" }}
          />

          {/* Flap: triangle covering the top half, hinges open */}
          <div
            className={`envelope-flap absolute inset-x-0 top-0 h-1/2 origin-top ${
              opening ? "animate-flap-open" : ""
            }`}
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            }}
          />

          {/* Wax seal */}
          <span
            className={`real-wax-seal absolute left-1/2 top-1/2 flex h-[5.3rem] w-[5.3rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center ${
              opening ? "animate-seal-vanish" : ""
            }`}
          >
            <img src="/was-seal.png" alt="" aria-hidden className="absolute inset-0 h-full w-full object-contain" />
            <img
              src="/k-monogram.png"
              alt="K"
              className="relative h-[58%] w-[58%] object-contain mix-blend-multiply opacity-80"
            />
          </span>
        </div>
      </button>

      <p className="relative z-10 mt-8 rounded-full bg-white/15 px-4 py-2 text-[13px] font-medium text-white/80 shadow-sm backdrop-blur-sm">
        Tap the wax seal to open
      </p>
    </div>
  );
}
