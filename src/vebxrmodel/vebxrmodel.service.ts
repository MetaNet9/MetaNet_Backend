import { Injectable, UseGuards, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vebxrmodel } from './entities/vebxrmodel.entity';
import { CreateVebxrmodelDto } from './dto/create-vebxrmodel.dto';
import { UpdateVebxrmodelDto } from './dto/update-vebxrmodel.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Category } from 'src/category/category.entity';
import { Seller } from 'src/seller/entities/seller.entity';

@Injectable()
export class VebxrmodelService {
  constructor(
    @InjectRepository(Vebxrmodel)
    private readonly vebxrmodelRepository: Repository<Vebxrmodel>,

    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,

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
    const seller = await this.sellerRepository.findOne({ where: { user: { id: userId } } });
    const vebxrModel = this.vebxrmodelRepository.create({
      ...createVebxrModelDto,
      category,              
      modelOwner: seller,   
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

  async findWithFilters(
    filters: {
      category?: number;
      minPrice?: number;
      maxPrice?: number;
      format?: string;
      license?: string;
      pbr?: boolean;
      animated?: boolean;
      rigged?: boolean;
    },
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ data: Vebxrmodel[]; total: number }> {
    const query = this.vebxrmodelRepository.createQueryBuilder('model');
  
    console.log('filters', filters);
  
    // Apply filters with type checking
    if (filters.category !== undefined && !isNaN(filters.category)) {
      query.andWhere('model.category = :category', { category: filters.category });
    }
    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      query.andWhere('model.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      query.andWhere('model.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }
    if (filters.format) {
      query.andWhere('model.format = :format', { format: filters.format });
    }
    if (filters.license) {
      query.andWhere('model.license = :license', { license: filters.license });
    }
    // if (filters.pbr !== undefined) {
    //   query.andWhere('model.pbr = :pbr', { pbr: filters.pbr });
    // }
    // if (filters.animated !== undefined) {
    //   query.andWhere('model.animation = :animated', { animated: filters.animated });
    // }
    // if (filters.rigged !== undefined) {
    //   query.andWhere('model.riggedGeometry = :rigged', { rigged: filters.rigged });
    // }
  
    console.log('Query:', query.getQueryAndParameters());
    // Apply pagination and retrieve data and total count
    const [data, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
  
    return { data, total };
  }
  

}
