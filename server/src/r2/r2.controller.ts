import { Controller, Post, Body } from '@nestjs/common';
import { R2Service } from './r2.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '../generated/prisma/enums';
import { UploadUrlDto } from './dto/upload-url.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('R2 Storage')
@ApiBearerAuth('access-token')
@Controller('r2')
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @ApiOperation({ summary: 'Get a presigned upload URL for R2 storage' })
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
