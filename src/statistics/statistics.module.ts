import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VebxrmodelService } from 'src/vebxrmodel/vebxrmodel.service';
import { StatisticsController } from './statistics.controller';
import { Vebxrmodel } from 'src/vebxrmodel/entities/vebxrmodel.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { User } from 'src/users/user.entity';
import { Category } from 'src/category/category.entity';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vebxrmodel, Payment, User, Category])],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
