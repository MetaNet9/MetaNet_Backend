import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCartDto: CreateCartDto, @Req() req) {
    return this.cartService.addToCart(req.user.userId, createCartDto.modelId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':modelId')
  removeFromCart(@Param('modelId')modelId:number,@Req() req){
    return this.cartService.removeFromCart(req.user.userId,modelId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@Req() req) {
    const userId = req.user.userId;

    return this.cartService.getCart(userId);
  }

  
}
