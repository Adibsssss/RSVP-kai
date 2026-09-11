// A Next.js `template.tsx` remounts on every navigation (unlike layout.tsx),
// so it's the right place for a page-change transition. This only fires
// when moving between routes (e.g. the invitation -> the RSVP form) — the
// envelope-opening interaction on "/" is handled separately and stays
// animation-free.
export default function Template({ children }: { children: React.ReactNode }) {
  // Opacity-only, deliberately no transform: a transform here would make
  // this div a containing block for any position:fixed descendant (like the
  // full-screen envelope), which breaks its sizing. `fade-in` is already
  // defined in tailwind.config.ts and only touches opacity.
  return <div className="animate-fade-in">{children}</div>;
}
