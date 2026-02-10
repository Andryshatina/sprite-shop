import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class R2Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.getOrThrow<string>('R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'R2_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async getPresignedUploadUrl(
    fileName: string,
    contentType: string,
    isPrivate: boolean,
  ) {
    try {
      const bucketName = isPrivate
        ? this.configService.getOrThrow<string>('R2_PRIVATE_BUCKET')
        : this.configService.getOrThrow<string>('R2_PUBLIC_BUCKET');

      const fileExtension = fileName.split('.').pop();
      const uniqueName = `${uuidv4()}.${fileExtension}`;
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueName,
        ContentType: contentType,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      return {
        uploadUrl,
        fileKey: uniqueName,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to generate presigned URL',
      );
    }
  }
}
