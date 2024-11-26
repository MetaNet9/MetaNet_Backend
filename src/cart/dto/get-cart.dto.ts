import { IsNumber, IsString } from 'class-validator';

export class GetCartDto {
  @IsNumber()
  modelId: number;

  @IsNumber()
  price: number;

  @IsString()
  userName: string;

  @IsString()
  modelUrl: string;

  @IsString()
  description: string;
}
