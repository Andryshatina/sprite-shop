import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UploadUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsBoolean()
  isPrivate: boolean;
}
