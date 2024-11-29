import { Module } from '@nestjs/common';
import { ReviewRequestService } from './review_request.service';
import { ReviewRequestController } from './review_request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ReviewRequest } from './entities/review_request.entity';
import { ModelEntity } from 'src/model/entities/model.entity';
import { Seller } from 'src/seller/entities/seller.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ReviewRequest, ModelEntity, Seller]),
  ],
  controllers: [ReviewRequestController],
  providers: [ReviewRequestService],
})
export class ReviewRequestModule {}
