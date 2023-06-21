/* eslint-disable @typescript-eslint/ban-types */

import { ExportExcelDetatilsDto } from "./export-excel-Detatils.dto";

export class ExportExcelDto {
  headers: ExportExcelDetatilsDto[];
  rows: Object[];
}
