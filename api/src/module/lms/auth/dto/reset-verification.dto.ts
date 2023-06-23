import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class ResetVerificationDto {
  @ApiProperty({ type: Number, description: "Reset code", default: "" })
  @IsNotEmpty({ message: i18nValidationMessage("validation.COMMON.NOT_EMPTY") })
  reset_code: number;
}
