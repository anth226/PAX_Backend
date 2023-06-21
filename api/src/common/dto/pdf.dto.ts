import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class PDFDto {
  @ApiProperty({
    type: String,
    description: "Header Columns",
    default: ["SL", "Name EN", "Name BN", "Status"],
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
    default: 4,
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
  @IsString()
  lang: string;

  @IsOptional()
  sortOrder?: string;
}
