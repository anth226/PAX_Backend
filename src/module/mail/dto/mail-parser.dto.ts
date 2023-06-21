// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsDefined,
//   IsEmail,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   ValidateNested,
// } from 'class-validator';
// import { Readable } from 'stream';
// import { MailFromDto } from './mail-from.dto';
// import { Type } from 'class-transformer';

// export class MailParserDto {
//   @ApiProperty({ type: MailFromDto })
//   @Type(() => MailFromDto)
//   @ValidateNested({ each: true })
//   from: MailFromDto;

//   @ApiProperty()
//   @IsDefined()
//   @IsEmail()
//   to: string;

//   @ApiProperty()
//   @IsNotEmpty()
//   @IsString()
//   subject: string;

//   @ApiProperty()
//   @IsOptional()
//   html: string | Buffer | Readable;
// }
