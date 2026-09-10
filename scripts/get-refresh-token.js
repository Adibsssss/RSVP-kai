#!/usr/bin/env node
/**
 * One-time helper to get an OAuth refresh token scoped to Google Sheets,
 * for the Google account that owns (or has Editor access to) the RSVP
 * spreadsheet. Same pattern as event-gallery's Drive token script.
 *
 * Usage:
 *   GOOGLE_OAUTH_CLIENT_ID=... GOOGLE_OAUTH_CLIENT_SECRET=... node scripts/get-refresh-token.js
 */
const http = require("http");
const { OAuth2Client } = require("google-auth-library");

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET first.");
  process.exit(1);
}

async function main() {
  const server = http.createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;

  const client = new OAuth2Client({ clientId, clientSecret, redirectUri });
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  console.log("\n1. Open this URL and sign in with the Google account that has");
  console.log("   edit access to the RSVP spreadsheet:\n");
  console.log(authUrl);
  console.log("\n2. Approve access — you'll be redirected back automatically.\n");

  const code = await new Promise((resolve, reject) => {
    server.on("request", (req, res) => {
      const url = new URL(req.url, redirectUri);
      const err = url.searchParams.get("error");
      const authCode = url.searchParams.get("code");
      res.setHeader("Content-Type", "text/html");
      if (err) {
        res.end(`<p>Authorization failed: ${err}. You can close this tab.</p>`);
        reject(new Error(err));
        return;
      }
      res.end("<p>Authorization complete — close this tab and return to the terminal.</p>");
      resolve(authCode);
    });
  });

  server.close();

  const { tokens } = await client.getToken({ code, redirect_uri: redirectUri });
  if (!tokens.refresh_token) {
    console.error(
      "\nNo refresh token was returned — this usually means this account already\n" +
        "granted access before. Revoke it at https://myaccount.google.com/permissions\n" +
        "and run this script again.",
    );
    process.exit(1);
  }

  console.log("\nSuccess. Add this to your environment:\n");
  console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
}

main().catch((err) => {
  console.error("\nFailed to get a refresh token:", err.message || err);
  process.exit(1);
});
