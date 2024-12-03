// seller.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { User, UserRole } from 'src/users/user.entity';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Inject User repository
  ) {}

  // Create a new seller
  async create(createSellerDto: CreateSellerDto, userId: number): Promise<Seller> {
    // Ensure the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Check if the user is already a seller
    const isSeller = await this.sellerRepository.findOne({ where: { user: { id: userId } } });
    if (isSeller) {
      throw new ConflictException('User is already a seller');
    }
  
    // Add the SELLER role to the user's roles
    if (!user.roles.includes(UserRole.SELLER)) {
      user.roles.push(UserRole.SELLER);
    }
  
    // Update the user entity with the new roles array
    await this.userRepository.save(user);
  
    // Create a new seller and associate it with the user
    const seller = this.sellerRepository.create({ ...createSellerDto, user });
  
    // Save the seller
    return this.sellerRepository.save(seller);
  }

  // Get all sellers
  async findAll(): Promise<Seller[]> {
    return await this.sellerRepository.find();
  }

  // Get seller by ID
  async findOne(id: number): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({ where: { id }, relations: ['user'] });
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    return seller;
  }

  // Update seller details
  async update(updateSellerDto: UpdateSellerDto, userId): Promise<Seller> {

    // find seller by the user id
    const seller = await this.sellerRepository.findOne({ where: { user: { id: userId } } });

    Object.assign(seller, updateSellerDto);
    return this.sellerRepository.save(seller);
  }

  // Delete seller by ID
  async remove(id: number): Promise<void> {
    const seller = await this.findOne(id);
    await this.sellerRepository.remove(seller);
  }

  async getMySellerAccount(userId: number): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({ where: { user: { id: userId } } });
    return seller;
  }
}
