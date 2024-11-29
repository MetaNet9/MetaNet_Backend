import { Module } from '@nestjs/common';
import { VebxrmodelService } from './vebxrmodel.service';
import { VebxrmodelController } from './vebxrmodel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vebxrmodel } from './entities/vebxrmodel.entity';
import { Category } from 'src/category/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { Seller } from 'src/seller/entities/seller.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vebxrmodel, Category, Seller])
  ],
  controllers: [VebxrmodelController],
  providers: [VebxrmodelService],
})
export class VebxrmodelModule {}
