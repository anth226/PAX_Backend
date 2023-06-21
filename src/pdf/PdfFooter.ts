export const PdfFooter = (doc: PDFKit.PDFDocument) => {
  doc
    .fontSize(10)
    .text("Islamic Foundation", 50, 680, { align: "center", width: 500 });
  doc.end();
};
