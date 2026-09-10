# RSVP-kai

## RSVP workbook setup

Upload `RSVP.xlsx` to Google Drive and open it as a Google Sheet, then put its
spreadsheet ID in `GOOGLE_SHEET_ID` in `.env.local`. Keep the tab name as
`RSVP` (or set `GOOGLE_SHEET_NAME` to the tab's name).

The app preserves the workbook's title and summary area in rows 1-4, writes
RSVP records below the row-5 headers, adds a `Message` column at D5, and keeps
the three summary figures current.
