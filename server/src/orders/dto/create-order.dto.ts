import { ArrayMinSize, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  @IsInt({ each: true })
  productIds: number[];
}
