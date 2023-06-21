import { Injectable } from "@nestjs/common";
import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs";
import { Stream } from "stream";
import { ExportExcelDto } from "../dto/export-excel.dto";

@Injectable()
export class XLSXGenService {
  async genXlsx(data: any[], sheetName = "sheet"): Promise<any> {
    // data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', getDate('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']]
    const ws = XLSX.utils.json_to_sheet(data);
    /* add to workbook */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return buf;
  }

  exportData = async (excelDto: ExportExcelDto): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.generateExcel(excelDto.headers, excelDto.rows)
        .then((xlsx) => {
          // console.log(xlsx);
          resolve(xlsx[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  private async generateExcel(columns, rows): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = rows;

      // const ExcelJS = require('ExcelJSjs');

      // need to create a workbook object. Almost everything in ExcelJSJS is based off of the workbook object.
      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("Report");

      worksheet.columns = columns;

      // force the columns to be at least as long as their header row.
      // Have to take this approach because ExcelJSJS doesn't have an autofit property.
      worksheet.columns.forEach((column) => {
        column.width =
          column?.header?.length < 12 ? 12 : column?.header?.length;
      });

      // Make the header bold.
      // Note: in ExcelJS the rows are 1 based, meaning the first row is 1 instead of 0.
      worksheet.getRow(1).font = { bold: true };

      // Dump all the data into ExcelJS
      if (data !== undefined) {
        data.forEach((e, index) => {
          // row 1 is the header.
          const rowIndex = index + 2;
          worksheet.columns.forEach((column, index) => {
            column.width =
              column?.header?.length > e[column?.key]?.length
                ? column?.header?.length + 5
                : e[column?.key]?.length + 5;
          });

          // By using destructuring we can easily dump all of the data into the row without doing much
          // We can add formulas pretty easily by providing the formula property.
          worksheet.addRow({
            ...e,
          });
        });
      }

      // const totalNumberOfRows = worksheet.rowCount;

      const calculatedDataRow = [];

      // columns.forEach((col, index) => {
      //   if (index === 0) {
      //     // calculatedDataRow.push("Total");
      //   } else if (!col.isCalulate) {
      //     calculatedDataRow.push("");
      //   } else {
      //     worksheet.getColumn(index).numFmt = "0.00";
      //     const columnPosition = this.cloumnValue(index + 1);
      //     calculatedDataRow.push({
      //       formula: `sum(${columnPosition}2:${columnPosition}${totalNumberOfRows})`,
      //     });
      //   }
      // });
      worksheet.addRow(calculatedDataRow);
      // worksheet.getRow(totalNumberOfRows + 1).font = { bold: true };

      // Create a freeze pane, which means we'll always see the header as we scroll around.
      worksheet.views = [
        { state: "frozen", xSplit: 0, ySplit: 1, activeCell: "A2" },
      ];

      // res.setHeader(
      //   'Content-Type',
      //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // );
      // res.setHeader(
      //   'Content-Disposition',
      //   'attachment; filename=' + Date.now() + '_report.xlsx',
      // );
      const buffer = new Array<any>();
      // workbook.xlsx.write(buffer).then((x) => {
      //   console.log(x);
      //   console.log(buffer);
      //   return buffer;
      // });

      const writableStream = new Stream.Writable();
      writableStream._write = (chunk, encoding, next) => {
        buffer.push(chunk);
        next();
      };
      writableStream._final = (callback) => {
        // if (err) console.log({ err });
        // console.log('Finished');
        // console.log({ buffer });
        resolve(buffer);
      };
      workbook.xlsx.write(writableStream).then((x) => {
        // console.log({ x });
      });
    });
  }

  private cloumnValue(columnNumber) {
    // To store result (Excel column name)
    const columnName = [];

    while (columnNumber > 0) {
      // Find remainder
      const rem = columnNumber % 26;

      // If remainder is 0, then a
      // 'Z' must be there in output
      if (rem == 0) {
        columnName.push("Z");
        columnNumber = Math.floor(columnNumber / 26) - 1;
      } // If remainder is non-zero
      else {
        columnName.push(String.fromCharCode(rem - 1 + "A".charCodeAt(0)));
        columnNumber = Math.floor(columnNumber / 26);
      }
    }

    return columnName;
  }
}
