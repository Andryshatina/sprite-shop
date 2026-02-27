import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Fire Sprite Pack' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A collection of animated fire sprites.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 499, description: 'Price in cents (USD)' })
  @IsInt({ message: 'Price must be an integer' })
  @Min(0, { message: 'Price must be at least 0' })
  price: number;

  @ApiProperty({ example: 'images/abc123.png' })
  @IsString()
  @IsNotEmpty()
  imageKey: string;

  @ApiProperty({ example: 'files/abc123.zip' })
  @IsString()
  @IsNotEmpty()
  fileKey: string;
}
