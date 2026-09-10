"use client";

import { useState } from "react";

interface EnvelopeProps {
  onOpened: () => void;
}

/**
 * A CSS-only envelope: a rectangle "body" with a triangular "flap" on top
 * (clip-path) and a wax seal centered on the seam. Tapping the seal cracks
 * it into two halves that fly apart while the monogram dissolves, the flap
 * folds open around its top edge, and a card slides up from inside; once
 * that animation finishes, onOpened() tells the parent to swap in the
 * invitation itself.
 */
export function Envelope({ onOpened }: EnvelopeProps) {
  const [opening, setOpening] = useState(false);

  function handleOpen() {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpened, 820);
  }

  return (
    <div className="envelope-scene fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="balloon balloon-blue" aria-hidden />
      <div className="balloon balloon-cloud" aria-hidden />
      <div className="balloon balloon-sky" aria-hidden />
      <div className="balloon balloon-confetti" aria-hidden />
      <div className="balloon balloon-stripe" aria-hidden />
      <div className="graffiti graffiti-kai" aria-hidden>
        KAI!
      </div>
      <div className="graffiti graffiti-party" aria-hidden>
        PARTY TIME
      </div>
      <div className="relative z-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cornflower">
          A special delivery
        </p>
        <p className="mt-2 font-display text-3xl text-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] sm:text-4xl">
          You&rsquo;re invited to Kai&rsquo;s celebration
        </p>
      </div>

      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open invitation"
        className="group relative z-10 mt-9 w-full max-w-sm transition-transform duration-300 hover:-translate-y-1 focus-visible:rounded-lg"
        style={{ perspective: "1200px" }}
      >
        <div className="relative aspect-[4/3] w-full drop-shadow-[0_24px_26px_rgba(23,50,89,0.24)] transition-all duration-300 group-hover:drop-shadow-[0_30px_34px_rgba(23,50,89,0.3)]">
          {/* Envelope body — the reference photo IS the paper texture now,
              duotoned navy via grayscale + overlay blend so real grain and
              folds show through instead of a faint ghost image. */}
          <div className="envelope-body absolute inset-0 overflow-hidden rounded-[6px]">
            <img
              src="/envelope-refernce.png"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-overlay grayscale contrast-125"
            />
          </div>
          <div
            className="envelope-rim absolute inset-[7px] rounded-[2px]"
            aria-hidden
          />
          <span className="envelope-crease" aria-hidden />

          {/* A real card peeking out above the closed envelope, with a
              small monogram watermark tying it back to the seal. */}
          <div
            className={`absolute inset-x-[12%] top-[-13%] h-[60%] rounded-sm bg-[#fffdf9] shadow-[0_-1px_0_rgba(255,255,255,.8),0_4px_10px_rgba(0,0,0,.28)] transition-all duration-500 ease-out ${
              opening
                ? "translate-y-0 rotate-0 opacity-100"
                : "translate-y-8 rotate-2 opacity-0"
            }`}
          >
            <div className="absolute inset-2 border border-cornflower/20" />
            <img
              src="/k-monogram.png"
              alt=""
              aria-hidden
              className="absolute bottom-2 right-2 h-5 w-5 object-contain opacity-40"
            />
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

          {/* Wax seal — cracks into two halves and flies apart on open,
              with the monogram dissolving independently. Idle pulse
              invites the tap while closed. */}
          <div className="absolute left-1/2 top-1/2 h-[5.6rem] w-[5.6rem] -translate-x-1/2 -translate-y-1/2">
            <div
              className={`real-wax-seal relative h-full w-full ${opening ? "" : "animate-seal-idle"}`}
            >
              <div
                className={`absolute inset-0 ${opening ? "animate-seal-crack-left" : ""}`}
                style={{ clipPath: "inset(0 50% 0 0)" }}
              >
                <img
                  src="/was-seal.png"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </div>
              <div
                className={`absolute inset-0 ${opening ? "animate-seal-crack-right" : ""}`}
                style={{ clipPath: "inset(0 0 0 50%)" }}
              >
                <img
                  src="/was-seal.png"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </div>
              <img
                src="/k-monogram.png"
                alt="K"
                className={`absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 object-contain mix-blend-multiply opacity-80 ${
                  opening ? "animate-monogram-fade" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </button>

      <p className="relative z-10 mt-8 rounded-full bg-white/15 px-4 py-2 text-[13px] font-medium text-white/80 shadow-sm backdrop-blur-sm">
        Tap the wax seal to open
      </p>
    </div>
  );
}
