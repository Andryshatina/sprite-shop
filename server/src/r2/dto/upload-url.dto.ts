import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadUrlDto {
  @ApiProperty({ example: 'fire-sprite-pack.png' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({
    example: false,
    description: 'Whether to upload to a private bucket',
  })
  @IsBoolean()
  isPrivate: boolean;
}
