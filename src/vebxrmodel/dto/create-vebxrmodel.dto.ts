export class CreateVebxrmodelDto {
  title: string;
  description: string;
  modelUrl: string;
  modelId: number;
  image1Url: string;
  image2Url: string;
  image3Url: string;
  category: number;
  tags: string[];
  downloadType: string;
  license: string;
  format: string;
  price: number;
}
