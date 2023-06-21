import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class PasswordForgotTokenOtpCheckDto {
  @ApiProperty({ type: String, description: "", default: "" })

  @ApiProperty({
    type: String,
    description: "12345",
    default: "a5033a619c85b719ab785024280966ddf765f79eaf4dcfd8d050d748fe78c4a1",
  })
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  otp: string;
}
