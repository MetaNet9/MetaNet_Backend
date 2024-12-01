import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vebxrmodel } from './entities/Vebxrmodel.entity';
import { CreateVebxrmodelDto } from './dto/create-Vebxrmodel.dto';
import { UpdateVebxrmodelDto } from './dto/update-Vebxrmodel.dto';
import { Seller } from 'src/seller/entities/seller.entity';
import { Category } from 'src/category/category.entity';
import { ReviewRequest } from 'src/review_request/entities/review_request.entity';

@Injectable()
export class VebxrmodelService {
  constructor(
    @InjectRepository(Vebxrmodel)
    private readonly VebxrmodelRepository: Repository<Vebxrmodel>,

    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

  ) {}
  

  async create(createVebxrmodelDto: CreateVebxrmodelDto, userId: number): Promise<Vebxrmodel> {
    const category = await this.categoryRepository.findOne({
      where: { id: createVebxrmodelDto.category },
    });
  
    if (!category) {
      throw new Error('Category not found');
    }
  
    const seller = await this.sellerRepository.findOne({ where: { user: { id: userId } } });
    if (!seller) {
      throw new Error('Seller not found');
    }
  
    const Vebxrmodel = this.VebxrmodelRepository.create({
      ...createVebxrmodelDto,
      category,
      modelOwner: seller,
    });
  
    return this.VebxrmodelRepository.save(Vebxrmodel);
  }
  

  findAll(): Promise<Vebxrmodel[]> {
    return this.VebxrmodelRepository.find();
  }

  findOne(id: number): Promise<Vebxrmodel> {
    return this.VebxrmodelRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.VebxrmodelRepository.delete(id);
  }

  async findWithFilters(
    filters: {
      category?: number;
      minPrice?: number;
      maxPrice?: number;
      format?: string;
      license?: string;
    },
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ data: Vebxrmodel[]; total: number }> {
    const query = this.VebxrmodelRepository.createQueryBuilder('model');

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

    const [data, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total };
  }

  async getFormattedModels() {
    const models = await this.VebxrmodelRepository.find({
      relations: ['modelOwner' , 'category'],
    });

    console.log(models);
  
    return models.map((model) => ({
      id: model.id,
      name: model.title,
      user: {
        name: model.modelOwner.displayName,
        image: model.modelOwner.profilePicture || 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
      },
      image: model.image1Url,
      category: model.category.name,
      price: model.price,
      reviews: model.review
    }));
  }

  async findSellerModels(sellerId: number): Promise<Vebxrmodel[]> {
    return this.VebxrmodelRepository.find({
      where: { modelOwner: { id: sellerId } },
    });
  }
  
  
}
