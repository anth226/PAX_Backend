import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class NoteIdParamDto {
  @ApiProperty({ type: String, description: "Id" })
  @IsString()
  @MinLength(10)
  @MaxLength(255)
  @IsNotEmpty()
  id: string;
}
