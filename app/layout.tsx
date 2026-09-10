import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/playfair-display";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kai's Birthday & Dedication — RSVP",
  description: "Join us in celebrating Kai's birthday and dedication.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#bfe3fa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
