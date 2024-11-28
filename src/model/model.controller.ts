import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import * as FormData from 'form-data';
import { ModelService } from './model.service';

@Controller('upload-and-analyze')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndAnalyze(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Step 1: Forward file to Flask app for analysis
    const flaskUrl = 'http://localhost:5000/upload';
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    try {
      const flaskResponse = await axios.post(flaskUrl, formData, {
        headers: formData.getHeaders(),
      });

      const analysisResult = flaskResponse.data;

      // Step 2: Save the analysis result in the database
      const savedModel = await this.modelService.saveModelDetails(
        file.originalname,
        analysisResult,
      );

      // Step 3: Return the result to the frontend
      return {
        success: true,
        message: 'Model analyzed and saved successfully',
        savedModel,
      };
    } catch (error) {
      console.error('Error communicating with Flask:', error.message);
      throw new Error('Failed to analyze the model');
    }
  }
}
