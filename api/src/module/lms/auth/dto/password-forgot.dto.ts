import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class PasswordForgotDto {
  @ApiProperty({ type: String, description: "Phone identifier", default: "" })
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  identifier: string;
}
