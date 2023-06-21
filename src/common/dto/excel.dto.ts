import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class ExcelDto {
  @ApiProperty({
    type: String,
    description: "Header Columns",
    default: ["Name EN", "Name BN"],
  })
  @IsArray()
  headerColumns: string[];

  @ApiProperty({
    type: String,
    description: "Column Keys",
    default: ["sl", "name_en", "name_bn", "status"],
    required: false,
  })
  @IsOptional()
  @IsArray()
  columnKeys?: string[];

  @ApiProperty({
    type: Number,
    description: "Total Columns",
    default: 2,
  })
  @IsNumber()
  totalColumns: number;

  @IsOptional()
  panelSearch: string;

  @ApiProperty({
    type: String,
    description: "Language",
    default: "bn",
  })
  @IsOptional()
  lang: string;

  @IsOptional()
  sortOrder?: string;
}
