import { IsString, IsBoolean, IsOptional, IsNumber, isNumber } from 'class-validator';
import { Double } from 'typeorm';
import { isFloat32Array } from 'util/types';

export class CreateVebxrmodelDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  modelUrl: string;

  @IsNumber()
  category: number;

  @IsString()
  tags: string;

  @IsString()
  downloadType: string;

  @IsOptional()
  @IsNumber()
  triangleCount?: number;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsString()
  license?: string;

  @IsOptional()
  @IsNumber()
  vertices?: number;

  @IsOptional()
  @IsString()
  textures?: string;

  @IsOptional()
  @IsNumber()
  uvLayers?: number;

  @IsOptional()
  @IsString()
  materials?: string;

  @IsBoolean()
  pbr: boolean;

  @IsBoolean()
  animation: boolean;

  @IsBoolean()
  vertexColors: boolean;

  @IsBoolean()
  riggedGeometry: boolean;

  @IsBoolean()
  morphGeometry: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  price?: number;
}


