import { ApiProperty } from '@nestjs/swagger';

export class UriTokenIdDTO {
  @ApiProperty({
    type: String,
    default: '6b2b861d6141652051b669309d4f',
    example: '6b2b861d6141652051b669309d4f',
    description: 'token id',
    required: true,
  })
  token: string;
}
