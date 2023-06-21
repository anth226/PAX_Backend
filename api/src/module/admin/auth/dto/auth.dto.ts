import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
export class AdminAuthDto {
  @ApiProperty({
    type: String,
    description: "Login identifier",
    default: "admin@gmail.com",
  })
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    type: String,
    description: "User Password",
    default: "IFAdmin123#",
  })
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  password: string;
}
