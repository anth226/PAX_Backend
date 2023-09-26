import { ApiProperty } from "@nestjs/swagger";
export class NoteListDto {

  @ApiProperty({
    type: String,
    description: "name",
    required: false,
  })
  name: string;

  @ApiProperty({
    type: String,
    description: "Email",
    required: false,
  })
  email: string;

}
