import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { AboutUsEnums } from "src/common/enums/admin/about-us.enum";
export class UpdateNoteDto {
  @ApiProperty({
    type: String,
    description: "District Name",
    default: "Dhaka",
  })
  @IsNotEmpty({ message: i18nValidationMessage("validation.COMMON.NOT_EMPTY") })
  @IsString({ message: "validation.DTO.INVALID_STRING" })
  @MinLength(3, { message: i18nValidationMessage("validation.DTO.MIN") })
  @MaxLength(64, { message: i18nValidationMessage("validation.DTO.MAX") })
  name: string;

  @ApiProperty({
    type: String,
    description: "District Name Bangla",
    default: "ঢাকা",
  })
  @IsNotEmpty({ message: i18nValidationMessage("validation.COMMON.NOT_EMPTY") })
  @IsString({ message: "validation.DTO.INVALID_STRING" })
  @MinLength(3, { message: i18nValidationMessage("validation.DTO.MIN") })
  @MaxLength(64, { message: i18nValidationMessage("validation.DTO.MAX") })
  email: string;

  @ApiProperty({
    type: String,
    description: "District Name Bangla",
    default: "ঢাকা",
  })
  @IsNotEmpty({ message: i18nValidationMessage("validation.COMMON.NOT_EMPTY") })
  @IsString({ message: "validation.DTO.INVALID_STRING" })
  @MinLength(3, { message: i18nValidationMessage("validation.DTO.MIN") })
  @MaxLength(64, { message: i18nValidationMessage("validation.DTO.MAX") })
  message: string;
}
