// eslint-disable-next-line prettier/prettier
import {ApiProperty} from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

/**
 * @Description Language DTO
 * @author
 * @version 0.0.1
 * @since 0.0.1
 */
export default class ContactUsDto {
  @ApiProperty({
    type: String,
    description: "Demo Name",
    default: "Demo",
    required: true,
  })
  @IsString()
  name: string;
  @ApiProperty({
    type: String,
    description: "Demo Name",
    default: "Demo@email.com",
    required: true,
  })
  @IsString()
  email: string;
  @ApiProperty({
    type: String,
    description: "Demo Message ",
    default: "Demo",
    required: true,
  })
  @IsString()
  message: string;
}
