import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt({ message: 'Price must be an integer' })
  @Min(0, { message: 'Price must be at least 0' })
  price: number;

  @IsString()
  @IsNotEmpty()
  imageKey: string;

  @IsString()
  @IsNotEmpty()
  fileKey: string;
}
