import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ReviewRequest } from './entities/review_request.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { User } from 'src/users/user.entity';
import { ModelEntity } from 'src/model/entities/model.entity';
import { CreateReviewRequestDto } from './dto/create-review_request.dto';

@Injectable()
export class ReviewRequestService {
  constructor(
    @InjectRepository(ReviewRequest)
    private readonly reviewRequestRepository: Repository<ReviewRequest>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ModelEntity)
    private readonly modelRepository: Repository<ModelEntity>,
  ) {}

  async createReviewRequest(createReviewRequestDto: Partial<CreateReviewRequestDto>, userId: number) {
    try {
      const reviewRequest = this.reviewRequestRepository.create(createReviewRequestDto);

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
    
      // Fetch the seller associated with the user
      const seller = await this.sellerRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      const modelId = createReviewRequestDto.modelId;
      const model = await this.modelRepository.findOne({ where: { id: modelId } });

      if (!model) {
        throw new NotFoundException('Model not found.');
      }
      // if (model.seller.id !== seller.id) {
      //   throw new BadRequestException('You are not the owner of this model.');
      // }

      reviewRequest.modelOwner = seller;
      reviewRequest.model = model;
      return await this.reviewRequestRepository.save(reviewRequest);
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException('Failed to create review request. Please check your input.');
    }
  }

  async updateStatus(id: number, resolved: boolean) {
    const reviewRequest = await this.reviewRequestRepository.findOne({ where: { id } });

    if (!reviewRequest) {
      throw new NotFoundException('Review request not found.');
    }

    reviewRequest.resolved = resolved;

    return await this.reviewRequestRepository.save(reviewRequest);
  }

  async deleteReviewRequest(id: number) {
    const reviewRequest = await this.reviewRequestRepository.findOne({ where: { id } });

    if (!reviewRequest) {
      throw new NotFoundException('Review request not found.');
    }

    return await this.reviewRequestRepository.remove(reviewRequest);
  }
}
