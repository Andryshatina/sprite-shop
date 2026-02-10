import { Controller, Post, Body } from '@nestjs/common';
import { R2Service } from './r2.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '../generated/prisma/enums';

import { UploadUrlDto } from './dto/upload-url.dto';

@Controller('r2')
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @Auth(Role.ADMIN)
  @Post('upload-url')
  async getPresignedUrl(@Body() uploadUrlDto: UploadUrlDto) {
    return this.r2Service.getPresignedUploadUrl(
      uploadUrlDto.fileName,
      uploadUrlDto.contentType,
      uploadUrlDto.isPrivate,
    );
  }
}
