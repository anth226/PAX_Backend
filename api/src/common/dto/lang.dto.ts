// eslint-disable-next-line prettier/prettier
import {ApiProperty} from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

/**
 * @Description Language DTO
 * @author
 * @version 0.0.1
 * @since 0.0.1
 */
export default abstract class LanguageDto {
  @ApiProperty({
    type: String,
    description: "Language",
    default: "bn",
    required: false,
  })
  @IsOptional()
  @IsString()
  lang?: string;
}
