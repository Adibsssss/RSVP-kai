// Server-only. Direct REST calls to the Sheets API — same reasoning as
// event-gallery's lib/google-drive.ts: skip the heavyweight `googleapis`
// package for a handful of endpoints.

import { OAuth2Client } from "google-auth-library";
import { serverConfig } from "./config";
import type { RsvpEntry, RsvpSubmission } from "@/types";

const SHEETS_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

export class SheetsApiError extends Error {
  constructor(
    message: string,
    public readonly detail: string,
  ) {
    super(message);
    this.name = "SheetsApiError";
  }
}

async function safeErrorText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 500);
  } catch {
    return "";
  }
}

let oauthClient: OAuth2Client | null = null;

function getClient(): OAuth2Client {
  if (!oauthClient) {
    oauthClient = new OAuth2Client({
      clientId: serverConfig.oauthClientId,
      clientSecret: serverConfig.oauthClientSecret,
    });
    oauthClient.setCredentials({
      refresh_token: serverConfig.oauthRefreshToken,
    });
  }
  return oauthClient;
}

async function getAccessToken(): Promise<string> {
  const { token } = await getClient().getAccessToken();
  if (!token) {
    throw new SheetsApiError(
      "Could not authenticate with Google Sheets.",
      "empty access token",
    );
  }
  return token;
}

function sheetRange(range: string): string {
  // Quote the tab name so this also works if it contains spaces or punctuation.
  return `'${serverConfig.sheetName.replace(/'/g, "''")}'!${range}`;
}

async function updateValues(
  values: { range: string; values: string[][] }[],
): Promise<void> {
  const token = await getAccessToken();
  const url = `${SHEETS_BASE}/${serverConfig.sheetId}/values:batchUpdate`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ valueInputOption: "USER_ENTERED", data: values }),
  });

  if (!res.ok) {
    throw new SheetsApiError(
      `Failed to prepare RSVP sheet (${res.status})`,
      await safeErrorText(res),
    );
  }
}

async function getSheetNumericId(token: string): Promise<number> {
  const metadataUrl = `${SHEETS_BASE}/${serverConfig.sheetId}?fields=sheets.properties`;
  const metadataRes = await fetch(metadataUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!metadataRes.ok) {
    throw new SheetsApiError(
      `Failed to inspect RSVP sheet (${metadataRes.status})`,
      await safeErrorText(metadataRes),
    );
  }

  const metadata = (await metadataRes.json()) as {
    sheets?: { properties?: { sheetId?: number; title?: string } }[];
  };
  const sheetId = metadata.sheets?.find(
    (sheet) => sheet.properties?.title === serverConfig.sheetName,
  )?.properties?.sheetId;
  if (sheetId === undefined) {
    throw new SheetsApiError(
      "Could not find the RSVP tab.",
      serverConfig.sheetName,
    );
  }
  return sheetId;
}

async function formatResponseRows(): Promise<void> {
  const token = await getAccessToken();
  const sheetId = await getSheetNumericId(token);

  const res = await fetch(
    `${SHEETS_BASE}/${serverConfig.sheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 5, // row 6; the first response row
                endRowIndex: 505,
                startColumnIndex: 0,
                endColumnIndex: 5, // A-E (Timestamp, Name, Attendance, Guests, Message)
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 1, green: 1, blue: 1 },
                  textFormat: {
                    foregroundColor: { red: 0, green: 0, blue: 0 },
                  },
                },
              },
              fields:
                "userEnteredFormat.backgroundColor,userEnteredFormat.textFormat.foregroundColor",
            },
          },
        ],
      }),
    },
  );

  if (!res.ok) {
    throw new SheetsApiError(
      `Failed to format RSVP rows (${res.status})`,
      await safeErrorText(res),
    );
  }
}

async function formatAttendanceCells(): Promise<void> {
  const token = await getAccessToken();
  const sheetId = await getSheetNumericId(token);
  const valuesRes = await fetch(
    `${SHEETS_BASE}/${serverConfig.sheetId}/values/${encodeURIComponent(sheetRange("C6:C505"))}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (!valuesRes.ok) {
    throw new SheetsApiError(
      `Failed to read RSVP attendance (${valuesRes.status})`,
      await safeErrorText(valuesRes),
    );
  }

  const data = (await valuesRes.json()) as { values?: string[][] };
  const requests = (data.values ?? []).flatMap((row, index) => {
    const color =
      row[0] === "Attending"
        ? { red: 0.13, green: 0.44, blue: 0.23 }
        : row[0] === "Not attending"
          ? { red: 0.62, green: 0.21, blue: 0.21 }
          : null;
    if (!color) return [];
    return [
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: index + 5,
            endRowIndex: index + 6,
            startColumnIndex: 2,
            endColumnIndex: 3,
          },
          cell: {
            userEnteredFormat: { textFormat: { foregroundColor: color } },
          },
          fields: "userEnteredFormat.textFormat.foregroundColor",
        },
      },
    ];
  });
  if (requests.length === 0) return;

  const res = await fetch(
    `${SHEETS_BASE}/${serverConfig.sheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    },
  );
  if (!res.ok) {
    throw new SheetsApiError(
      `Failed to format RSVP attendance (${res.status})`,
      await safeErrorText(res),
    );
  }
}

/**
 * Keeps the supplied RSVP workbook's layout intact:
 * - rows 1-4 are its title and summary cards
 * - row 5 is the response-table header
 * - responses begin on row 6
 */
async function prepareRsvpSheet(): Promise<void> {
  await updateValues([
    { range: sheetRange("D5"), values: [["Guests"]] },
    { range: sheetRange("E5"), values: [["Message"]] },
    {
      range: sheetRange("A4:D4"),
      values: [
        [
          "=COUNTA(A6:A)",
          '=COUNTIF(C6:C,"Attending")',
          '=COUNTIF(C6:C,"Not attending")',
          "=SUM(D6:D)",
        ],
      ],
    },
  ]);
  await formatResponseRows();
  await formatAttendanceCells();
}

function readableTimestamp(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

/** Appends one RSVP to the response table in the supplied workbook. */
export async function appendRsvp(entry: RsvpSubmission): Promise<void> {
  await prepareRsvpSheet();
  const token = await getAccessToken();
  const range = sheetRange("A5:E");
  const url = `${SHEETS_BASE}/${serverConfig.sheetId}/values/${encodeURIComponent(
    range,
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [
        [
          readableTimestamp(),
          entry.name,
          entry.attending === "yes" ? "Attending" : "Not attending",
          entry.attending === "yes" ? entry.guestCount : "",
          entry.message,
        ],
      ],
    }),
  });

  if (!res.ok) {
    throw new SheetsApiError(
      `Failed to save RSVP (${res.status})`,
      await safeErrorText(res),
    );
  }
  await formatAttendanceCells();
}

/** Reads the supplied workbook's response rows, oldest first. */
export async function listRsvps(): Promise<RsvpEntry[]> {
  const token = await getAccessToken();
  const range = sheetRange("A6:E");
  const url = `${SHEETS_BASE}/${serverConfig.sheetId}/values/${encodeURIComponent(
    range,
  )}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new SheetsApiError(
      `Failed to load RSVPs (${res.status})`,
      await safeErrorText(res),
    );
  }

  const data = (await res.json()) as { values?: string[][] };
  return (data.values ?? [])
    .filter((row) => row[1]) // skip any fully-blank row
    .map((row) => ({
      timestamp: row[0] ?? "",
      name: row[1] ?? "",
      attending: row[2] === "Attending" ? "yes" : "no",
      guestCount: Number(row[3]) || 0,
      message: row[4] ?? "",
    }));
}
