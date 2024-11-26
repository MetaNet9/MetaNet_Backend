import { Module } from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { TransactionsController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { SellerModule } from 'src/seller/seller.module';  // Make sure the Seller module is imported if needed
import { Seller } from 'src/seller/entities/seller.entity';  // Import Seller entity

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Seller]),  // Add Seller here to make it available in the service
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
