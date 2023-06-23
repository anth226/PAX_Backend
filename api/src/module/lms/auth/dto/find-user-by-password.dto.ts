import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class FindUserByPasswordDto {

  @ApiProperty({
    type: String,
    description: "email ",
    default: "alamin258000@gmail.com",
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: "password ",
    default: "123456",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
