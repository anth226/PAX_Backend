import { createWriteStream } from "fs";

export const PdfHeader = (doc: PDFKit.PDFDocument) => {
  doc.pipe(createWriteStream("output.pdf"));
  doc
    .fontSize(25)
    .text("Islamic Foundation.", { align: "center" })
    .fontSize(10)
    .moveDown();
  doc.fontSize(20).text("Designation", { align: "center" }).moveDown();
  doc.registerFont("Bangla", "fonts/bangla.ttf");
  doc.font("Bangla");
};
