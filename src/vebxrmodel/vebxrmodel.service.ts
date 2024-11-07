import { Injectable, UseGuards, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vebxrmodel } from './entities/vebxrmodel.entity';
import { CreateVebxrmodelDto } from './dto/create-vebxrmodel.dto';
import { UpdateVebxrmodelDto } from './dto/update-vebxrmodel.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Category } from 'src/category/category.entity';

@Injectable()
export class VebxrmodelService {
  constructor(
    @InjectRepository(Vebxrmodel)
    private readonly vebxrmodelRepository: Repository<Vebxrmodel>,

    @InjectRepository(Category) // Inject Category repository here
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createVebxrModelDto: CreateVebxrmodelDto, userId: number): Promise<Vebxrmodel> {
    const category = await this.categoryRepository.findOne({
      where: { id: createVebxrModelDto.category },
    });
  
    if (!category) {
      throw new Error('Category not found'); 
    }
    const vebxrModel = this.vebxrmodelRepository.create({
      ...createVebxrModelDto,
      category,              
      modelOwner: userId,   
    });
    return this.vebxrmodelRepository.save(vebxrModel);
  }
  


  findAll(): Promise<Vebxrmodel[]> {
    return this.vebxrmodelRepository.find();
  }

  findOne(id: number): Promise<Vebxrmodel> {
    return this.vebxrmodelRepository.findOne({ where: { id } });
  }

  // async update(id: number, updateVebxrModelDto: UpdateVebxrmodelDto): Promise<Vebxrmodel> {
  //   await this.vebxrmodelRepository.update(id, updateVebxrModelDto);
  //   return this.vebxrmodelRepository.findOne({ where: { id } });
  // }

  async remove(id: number): Promise<void> {
    await this.vebxrmodelRepository.delete(id);
  }
}
