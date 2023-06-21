import { readFileSync } from "fs";
import hbs from "handlebars";
import dateConverter from "src/common/function/DateConverter";
import numberConverter from "src/common/function/NumberConverter";
import {
  convertBanglaToEnglishMonth,
  statusConverter,
} from "src/common/function/StatusConverter";
export const PdfTable = (
  doc: PDFKit.PDFDocument,
  totalColumns: number,
  headerColumns: string[]
) => {
  let positionX;
  for (let i = 0; i < totalColumns; i++) {
    positionX = i === 0 ? 40 : positionX + 100;
    doc
      .fontSize(15)
      .text(headerColumns[i], positionX, 200, { width: 110, align: "center" });
  }
  generateHr(doc, 225);
};

export const generateTableRow = (doc, y, c1, c2, c3, c4, c5) => {
  doc
    .fontSize(10)
    .text(c1, 30, y, { width: 130, align: "center" })
    .text(c2, 140, y, { width: 130, align: "center" })
    .text(c3, 240, y, { width: 130, align: "center" })
    .text(c4, 340, y, { width: 90, align: "center" })
    .text(c5, 440, y, { align: "center" });
};

export function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(40, y).lineTo(550, y).stroke();
}

export const compile = async (
  templateName: string,
  data: any,
  lang: string
) => {
  const filePath = `templatespdf/${templateName}.hbs`;
  const html = await readFileSync(filePath, "utf8");
  const header = await readFileSync("templatespdf/layouts/header.hbs", "utf8");
  const footer = await readFileSync("templatespdf/layouts/footer.hbs", "utf8");
  hbs.registerPartial("header", header);
  hbs.registerPartial("footer", footer);
  hbs.registerHelper("inc", (value) => {
    return numberConverter(lang, value + 1);
  });
  hbs.registerHelper("status", (value) => {
    return statusConverter(lang, value);
  });
  hbs.registerHelper("date", (value) => {
    return dateConverter(lang, value);
  });
  hbs.registerHelper("number", (value) => {
    return numberConverter(lang, value);
  });
  hbs.registerHelper("month", (value) => {
    return convertBanglaToEnglishMonth(lang, value);
  });
  hbs.registerHelper("equals", function (string1, string2, options) {
    if (string1 === string2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  return hbs.compile(html)(data);
};
