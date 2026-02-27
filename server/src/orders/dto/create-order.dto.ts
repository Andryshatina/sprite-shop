import { ArrayMinSize, IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of product IDs to order',
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  @IsInt({ each: true })
  productIds: number[];
}
