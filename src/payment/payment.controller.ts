// payment.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetTransactionsDto } from './dto/transactions.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('buy')
  async purchaseItems(
    @Req() req,
    @Body('modelIds') modelIds: number[],
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    const userId = req.user.userId;
    return this.paymentService.purchaseItems(userId, modelIds, paymentMethodId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('purchases')
  getPurchasedItems(@Req() req) {
    const userId = req.user.userId;
    return this.paymentService.getPurchasedItems(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('review')
  addReview(
    @Req() req,
    @Body('modelId') modelId: number,
    @Body('reviewMessage') reviewMessage: string,
    @Body('reviewStars') reviewStars: number,
  ) {
    const userId = req.user.userId;
    return this.paymentService.addReview(userId, modelId, reviewMessage, reviewStars);
  }

  @Get('transactions')
  async getTransactions(@Query() filters: GetTransactionsDto) {
    return this.paymentService.getTransactions(filters);
  }
}
