import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ForgotPasswordOtpDto {
  @ApiProperty({
    type: String,
    description: "Phone oR Email identifier",
    default: "",
  })
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ type: String, description: "Otp", default: "458777" })
  @MaxLength(200)
  @IsNotEmpty()
  otp: number;
}
