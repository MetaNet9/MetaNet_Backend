// payment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { Vebxrmodel } from 'src/vebxrmodel/entities/vebxrmodel.entity';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Vebxrmodel])], // Register the entities
  controllers: [PaymentController],
  providers: [PaymentService, StripeService],
})
export class PaymentModule {}
