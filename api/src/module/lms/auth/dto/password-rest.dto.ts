import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class PasswordRestDto {
  @ApiProperty({ type: String, description: "id", default: "" })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: Number, description: "Reset code", default: "" })
  @IsString()
  @IsNotEmpty()
  reset_code: number;

  @ApiProperty({ type: String, description: "Password", default: "123456" })
  @MaxLength(200)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: "Confirm password",
    default: "123456",
  })
  @MaxLength(200)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}
