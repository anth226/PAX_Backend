import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class PasswordForgotTokenDto {
  @ApiProperty({ type: String, description: "", default: "" })
  // @MaxLength(200)
  // @IsString()
  // @IsNotEmpty()
  // token: string;

  @ApiProperty({
    type: String,
    description: "12345",
    default: "a5033a619c85b719ab785024280966ddf765f79eaf4dcfd8d050d748fe78c4a1",
  })
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    type: String,
    description: "#IFAdmin123#",
    default: "IFAdmin123#",
  })
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  password: string;
}
