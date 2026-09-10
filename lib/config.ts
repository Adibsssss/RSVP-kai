// Server-only. Never import this file from a Client Component.

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.local.example.`,
    );
  }
  return value;
}

export const serverConfig = {
  get oauthClientId(): string {
    return required("GOOGLE_OAUTH_CLIENT_ID");
  },
  get oauthClientSecret(): string {
    return required("GOOGLE_OAUTH_CLIENT_SECRET");
  },
  get oauthRefreshToken(): string {
    return required("GOOGLE_OAUTH_REFRESH_TOKEN");
  },
  get sheetId(): string {
    return required("GOOGLE_SHEET_ID");
  },
  get sheetName(): string {
    return process.env.GOOGLE_SHEET_NAME?.trim() || "RSVP";
  },
};

/** The event itself — edit these in one place if the details ever change. */
export const eventConfig = {
  childName: "Kai",
  title: "Kai's Birthday & Dedication",
  venueName: "Café Clotilde Ph",
  venueAddress:
    "Anahawon, Bryton - Seaoil Compound, Sayre Hwy, Maramag, 8714 Bukidnon",
  // ISO string with explicit UTC+8 offset so the countdown is correct
  // regardless of the visitor's or server's local timezone.
  startsAtISO: "2026-09-16T15:00:00+08:00",
  endsAtISO: "2026-09-16T19:00:00+08:00",
  dateLabel: "September 16, 2026",
  timeLabel: "3:00 PM – 7:00 PM",
  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8095829.970648359!2d115.258914525!3d7.785374300000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32ff3d1c953831d1%3A0xd02ad7922f33113b!2sCaf%C3%A9%20Clotilde%20Ph!5e0!3m2!1sen!2sph!4v1789045350620!5m2!1sen!2sph",
  // Edit or remove — shown on the RSVP page like the sample's "Questions
  // and Clarifications" contact block.
  contacts: [] as { label: string; number: string }[],
};
