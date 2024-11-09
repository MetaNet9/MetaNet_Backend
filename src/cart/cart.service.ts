import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from 'src/users/user.entity'; // Adjust path
import { Vebxrmodel } from 'src/vebxrmodel/entities/vebxrmodel.entity'; // Adjust path

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vebxrmodel)
    private readonly vebxrmodelRepository: Repository<Vebxrmodel>,
  ) {}

  // Add a model to the cart for a specific user
  async addToCart(userId: number, modelId: number): Promise<Cart> {

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const model = await this.vebxrmodelRepository.findOne({ where: { id: modelId } });
    if (!model) {
      throw new Error('Model not found');
    }

    if (!user || !model) {
      throw new Error('User or model not found');
    }

    const cartItem = this.cartRepository.create({
      user,
      model
    });

    return this.cartRepository.save(cartItem);
  }

  // Get all cart items for a user
  async getCart(userId: number): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['model', 'user'],
    });
  }

  // Remove an item from the cart
  async removeFromCart(userId: number, modelId: number): Promise<void> {
    const cartItem = await this.cartRepository.findOne({
      where: { user: { id: userId }, model: { id: modelId } },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await this.cartRepository.remove(cartItem);
  }
}
