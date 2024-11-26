// payment.service.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Vebxrmodel } from 'src/vebxrmodel/entities/vebxrmodel.entity';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Vebxrmodel)
    private modelRepository: Repository<Vebxrmodel>,
    private stripeService: StripeService,
  ) {}

  async purchaseItems(userId: number, modelIds: number[], paymentMethodId: string) {
    const stripe = this.stripeService.getClient();
    const purchases = [];
    let totalAmount = 0;

    for (const modelId of modelIds) {
      const model = await this.modelRepository.findOne({ where: { id: modelId } });

      if (!model) {
        throw new Error(`Model with ID ${modelId} not found.`);
      }

      totalAmount += model.price * 100; // Convert to cents
    }

    // Create a PaymentIntent
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: totalAmount,
    //   currency: 'usd',
    //   payment_method: paymentMethodId,
    //   confirm: true,
    // });

    // if (paymentIntent.status !== 'succeeded') {
    //   throw new Error('Payment failed.');
    // }

    // Record each purchase
    for (const modelId of modelIds) {
      const payment = this.paymentRepository.create({
        user: { id: userId },
        model: { id: modelId },
        amount: totalAmount / 100, // Convert back to dollars
      });

      purchases.push(await this.paymentRepository.save(payment));
    }

    return purchases;
  }

  async getPurchasedItems(userId: number) {
    return this.paymentRepository.find({ where: { user: { id: userId } } });
  }

  async addReview(userId: number, modelId: number, reviewMessage: string, reviewStars: number) {
    const purchase = await this.paymentRepository.findOne({
      where: { user: { id: userId }, model: { id: modelId } },
    });

    if (!purchase) {
      throw new Error('Purchase not found or user does not own this item.');
    }

    purchase.reviewMessage = reviewMessage;
    purchase.reviewStars = reviewStars;

    return this.paymentRepository.save(purchase);
  }
}
