import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { R2Service } from './r2.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('r2')
@UseGuards(AuthGuard('jwt'))
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @Post('upload-url')
  async getPresignedUrl(
    @Body('fileName') fileName: string,
    @Body('contentType') contentType: string,
  ) {
    return this.r2Service.getPresignedUploadUrl(fileName, contentType);
  }
}
