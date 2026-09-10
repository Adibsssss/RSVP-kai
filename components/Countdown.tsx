"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetISO: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function computeTimeLeft(targetISO: string): TimeLeft {
  const diffMs = new Date(targetISO).getTime() - Date.now();
  if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: false,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function Countdown({ targetISO }: CountdownProps) {
  // Starts null so the server-rendered markup and the first client render
  // match (server has no reliable "now"); fills in after mount.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(computeTimeLeft(targetISO));
    const interval = setInterval(() => setTimeLeft(computeTimeLeft(targetISO)), 1000);
    return () => clearInterval(interval);
  }, [targetISO]);

  if (!timeLeft) {
    return <div className="h-[4.5rem]" aria-hidden />;
  }

  if (timeLeft.done) {
    return <p className="font-display text-2xl text-ink">It&rsquo;s happening! 🎉</p>;
  }

  const units: { label: string; value: number }[] = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div>
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-cornflower">
        Countdown
      </p>
      <div className="mt-2 flex items-start justify-center gap-3 sm:gap-5">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-start gap-3 sm:gap-5">
            <div className="text-center">
              <p className="font-display text-4xl text-ink sm:text-5xl">{pad(unit.value)}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted">
                {unit.label}
              </p>
            </div>
            {i < units.length - 1 && (
              <span className="mt-1 font-display text-3xl text-line sm:text-4xl">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
