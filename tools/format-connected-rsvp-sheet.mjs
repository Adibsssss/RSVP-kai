import fs from "node:fs/promises";
import { OAuth2Client } from "google-auth-library";

const envText = await fs.readFile(".env.local", "utf8");
const readEnv = (name) => {
  const match = envText.match(new RegExp(`^${name}=(.*)$`, "m"));
  if (!match) throw new Error(`Missing ${name}`);
  return match[1].trim().replace(/^"|"$/g, "");
};

const client = new OAuth2Client({
  clientId: readEnv("GOOGLE_OAUTH_CLIENT_ID"),
  clientSecret: readEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
});
client.setCredentials({ refresh_token: readEnv("GOOGLE_OAUTH_REFRESH_TOKEN") });
const { token } = await client.getAccessToken();
if (!token) throw new Error("Could not obtain a Google access token.");

const spreadsheetId = readEnv("GOOGLE_SHEET_ID");
const sheetName = readEnv("GOOGLE_SHEET_NAME");
const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
const info = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`, { headers });
if (!info.ok) throw new Error(`Could not inspect spreadsheet (${info.status}).`);
const data = await info.json();
const sheetId = data.sheets?.find((sheet) => sheet.properties?.title === sheetName)?.properties?.sheetId;
if (sheetId === undefined) throw new Error(`Could not find tab: ${sheetName}`);

const attendance = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`'${sheetName}'!C6:C505`)}`,
  { headers },
);
if (!attendance.ok) throw new Error(`Could not read attendance values (${attendance.status}).`);
const attendanceValues = (await attendance.json()).values ?? [];
const attendanceRequests = attendanceValues.flatMap((row, index) => {
  const color = row[0] === "Attending"
    ? { red: 0.13, green: 0.44, blue: 0.23 }
    : row[0] === "Not attending"
      ? { red: 0.62, green: 0.21, blue: 0.21 }
      : null;
  if (!color) return [];
  return [{
    repeatCell: {
      range: { sheetId, startRowIndex: index + 5, endRowIndex: index + 6, startColumnIndex: 2, endColumnIndex: 3 },
      cell: { userEnteredFormat: { textFormat: { foregroundColor: color } } },
      fields: "userEnteredFormat.textFormat.foregroundColor",
    },
  }];
});

const result = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    requests: [{
      repeatCell: {
        range: { sheetId, startRowIndex: 5, endRowIndex: 505, startColumnIndex: 0, endColumnIndex: 4 },
        cell: { userEnteredFormat: {
          backgroundColor: { red: 1, green: 1, blue: 1 },
          textFormat: { foregroundColor: { red: 0, green: 0, blue: 0 } },
        } },
        fields: "userEnteredFormat.backgroundColor,userEnteredFormat.textFormat.foregroundColor",
      },
    }, ...attendanceRequests],
  }),
});
if (!result.ok) throw new Error(`Could not format response rows (${result.status}).`);
console.log("Formatted RSVP response rows and attendance colors.");
