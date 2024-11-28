import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModelEntity } from './entities/model.entity'; 

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(ModelEntity)
    private readonly modelRepository: Repository<ModelEntity>,
  ) {}

  async validateModel(filePath: string): Promise<any> {
    try {
      const response = await axios.post('http://localhost:5000/validate', { filePath });
      return response.data;
    } catch (error) {
      throw new HttpException('Validation service error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async saveModelDetails(fileName: string, validationResult: any): Promise<ModelEntity> {
    const model = this.modelRepository.create({
      fileName,
      parameters: validationResult.parameters || validationResult,
      valid: validationResult.valid || false,
    });
  
    return this.modelRepository.save(model);
  }
  
}
