import { EExcelColumnType } from "../enums/excel-column-type";

export class ExportExcelDetatilsDto {
  header: string;
  key: string;
  type: EExcelColumnType;
  isCalulate: boolean;
}
