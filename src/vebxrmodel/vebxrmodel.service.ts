import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Vebxrmodel } from './entities/Vebxrmodel.entity';
import { CreateVebxrmodelDto } from './dto/create-Vebxrmodel.dto';
import { UpdateVebxrmodelDto } from './dto/update-Vebxrmodel.dto';
import { Seller } from 'src/seller/entities/seller.entity';
import { Category } from 'src/category/category.entity';
import { ReviewRequest } from 'src/review_request/entities/review_request.entity';
import { ModelEntity } from 'src/model/entities/model.entity';
import { UserLikes } from 'src/userlikes/entities/userlike.entity';

@Injectable()
export class VebxrmodelService {
  
  constructor(
    @InjectRepository(Vebxrmodel)
    private readonly VebxrmodelRepository: Repository<Vebxrmodel>,

    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(ModelEntity)
    private readonly modelRepository: Repository<ModelEntity>,

    @InjectRepository(UserLikes)
    private readonly userLikesRepository: Repository<UserLikes>,

  ) {}
  

  async create(createVebxrmodelDto: CreateVebxrmodelDto, userId: number): Promise<Vebxrmodel> {
    const category = await this.categoryRepository.findOne({
      where: { id: createVebxrmodelDto.category },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const model = await this.modelRepository.findOne({
      where: { id: createVebxrmodelDto.modelId },
    });
  
    if (!model) {
      throw new Error('Model not found');
    }
  
    const seller = await this.sellerRepository.findOne({ where: { user: { id: userId } } });
    if (!seller) {
      throw new Error('Seller not found');
    }

    const format = createVebxrmodelDto.format.toUpperCase();
  
    const savedvebxrmodel = await this.VebxrmodelRepository.save({
      ...createVebxrmodelDto,
      category,
      model,
      format,
      modelOwner: seller,
    });

    // console.log('Saved Model:', savedvebxrmodel);

    // send images to AI model
    const response = fetch('http://127.0.0.1:5000/submit_ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelID: savedvebxrmodel.id,
        ImageUrls: [createVebxrmodelDto.image1Url, createVebxrmodelDto.image2Url, createVebxrmodelDto.image3Url],
        description: createVebxrmodelDto.description,
      }),
    });
  
    return savedvebxrmodel;
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

  async findWithFiltersandLikes(
    filters: {
      category?: number;
      minPrice?: number;
      maxPrice?: number;
      format?: string;
      license?: string;
    },
    userId: number,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ data: (Vebxrmodel & { isUserLiked: boolean })[]; total: number }> {
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
  
    // Fetch paginated models
    const [models, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

      // const existingLike = await this.userLikesRepository.findOne({
      //   where: { user: { id: userId }, model: { id: modelId } },
      // });
  
    // Fetch likes for the user and models
    const likedModelIds = await this.userLikesRepository
      .createQueryBuilder('like')
      .select('like.model.id')
      .where('like.user.id = :userId', { userId })
      .andWhere('like.model.id IN (:...modelIds)', { modelIds: models.map((m) => m.id) })
      .getRawMany();
  
    const likedModelIdSet = new Set(likedModelIds.map((like) => like.like_modelId));
  
    // Add `isUserLiked` flag to each model
    const data = models.map((model) => ({
      ...model,
      isUserLiked: likedModelIdSet.has(model.id),
    }));
  
    return { data, total };
  }
  

  async getFormattedModels() {
    const models = await this.VebxrmodelRepository.find({
      relations: ['modelOwner' , 'category'],
    });
  
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
  
  async askFromAI(question: string, modelId: number) {

    const model = await this.VebxrmodelRepository.findOne({ where: { id: modelId }, relations: ['model'] });
    if (!model) {
      throw new Error('Model not found');
    }
    console.log('Model:', model);

    const jsonOfModel = JSON.stringify(model);
    console.log('Model:', jsonOfModel);

    const response = await fetch('http://127.0.0.1:5000/ask_ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        model: jsonOfModel,
        question 
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new Error('AI model error');
  }
  
}
