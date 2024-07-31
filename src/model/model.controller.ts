import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ModelService } from './model.service';
import * as path from 'path';
import * as fs from 'fs';
import { multer, Multer } from 'multer';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post('upload')
//   @UseInterceptors(FileInterceptor('file', {
//     storage: multer.diskStorage ({
//       destination: './uploads',
//       filename: (req, file, callback) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//       },
//     }),
//   }))
  async uploadFile(@UploadedFile() file: Multer.File): Promise<any> { 
    try {
      const filePath = path.join(__dirname, '../../uploads', file.filename);
      const analysisResult = await this.modelService.analyzeModel(filePath);
      fs.unlinkSync(filePath); // Delete file after analysis
      return analysisResult;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload and analyze the model');
    }
  }
}
