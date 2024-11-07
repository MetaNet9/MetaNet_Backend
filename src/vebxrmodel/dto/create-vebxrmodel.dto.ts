import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateVebxrmodelDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  modelUrl: string;

  @IsString()
  category: string;

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
}
