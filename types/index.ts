export type Attending = "yes" | "no";

export interface RsvpSubmission {
  name: string;
  attending: Attending;
  guestCount: number;
  message: string;
}

export interface RsvpEntry extends RsvpSubmission {
  timestamp: string;
}

export interface ApiErrorBody {
  error: string;
}
