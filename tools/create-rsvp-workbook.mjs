import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "outputs/rsvp-website-template";
await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("RSVP");
sheet.showGridLines = false;
sheet.tabColor = "#5B7DB1";

sheet.getRange("A1:D1").merge();
sheet.getRange("A1").values = [["EVENT RSVP"]];
sheet.getRange("A1:D1").format = {
  fill: "#5B7DB1",
  font: { name: "Arial", size: 16, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
};
sheet.getRange("A1:D1").format.rowHeight = 32;

sheet.getRange("A2").values = [["Guest attendance tracker"]];
sheet.getRange("A2").format = {
  font: { name: "Arial", size: 10, italic: true, color: "#5E6775" },
  verticalAlignment: "center",
};
sheet.getRange("D2").values = [["Website responses appear below"]];
sheet.getRange("D2").format = {
  font: { name: "Arial", size: 10, italic: true, color: "#5E6775" },
  horizontalAlignment: "right",
  verticalAlignment: "center",
};

sheet.getRange("A3:C3").values = [["TOTAL RSVPs", "ATTENDING", "NOT ATTENDING"]];
sheet.getRange("A3:C3").format = {
  fill: "#DDE8F8",
  font: { name: "Arial", size: 10, bold: true, color: "#2E4C78" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
sheet.getRange("A4:C4").formulas = [[
  "=COUNTA(A6:A505)",
  '=COUNTIF(C6:C505,"Attending")',
  '=COUNTIF(C6:C505,"Not attending")',
]];
sheet.getRange("A4:C4").format = {
  fill: "#F4F8FE",
  font: { name: "Arial", size: 16, bold: true, color: "#233650" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  numberFormat: "#,##0",
  borders: { preset: "outside", style: "thin", color: "#B9C8DC" },
};
sheet.getRange("A3:C3").format.rowHeight = 24;
sheet.getRange("A4:C4").format.rowHeight = 34;

sheet.getRange("A5:D5").values = [["Timestamp", "Name", "Attendance", "Message"]];
sheet.getRange("A5:D5").format = {
  fill: "#2E4C78",
  font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: { preset: "all", style: "thin", color: "#FFFFFF" },
};
sheet.getRange("A5:D5").format.rowHeight = 28;

const responseArea = sheet.getRange("A6:D505");
responseArea.format = {
  font: { name: "Arial", size: 10, color: "#263238" },
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "insideHorizontal", style: "thin", color: "#E4EAF1" },
};
sheet.getRange("A6:C505").format.verticalAlignment = "center";
sheet.getRange("A6:A505").format.columnWidth = 26;
sheet.getRange("B6:B505").format.columnWidth = 28;
sheet.getRange("C6:C505").format.columnWidth = 18;
sheet.getRange("D6:D505").format.columnWidth = 64;
sheet.getRange("A6:D505").format.rowHeight = 42;
sheet.getRange("C6:C505").dataValidation = {
  rule: { type: "list", values: ["Attending", "Not attending"] },
};
sheet.getRange("C6:C505").conditionalFormats.add("containsText", {
  text: "Attending",
  format: { fill: "#E4F3E8", font: { color: "#23703A", bold: true } },
});
sheet.getRange("C6:C505").conditionalFormats.add("containsText", {
  text: "Not attending",
  format: { fill: "#FCE8E8", font: { color: "#A03636", bold: true } },
});

sheet.freezePanes.freezeRows(5);
workbook.recalculate();

const check = await workbook.inspect({
  kind: "table",
  range: "RSVP!A1:D8",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 4,
});
console.log(check.ndjson);
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 50 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({ sheetName: "RSVP", range: "A1:D15", scale: 2, format: "png" });
await fs.writeFile(`${outputDir}/preview.png`, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(`${outputDir}/RSVP-website-template.xlsx`);
