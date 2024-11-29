import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewRequestService } from './review_request.service';
import { ReviewRequest } from './entities/review_request.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('review-requests')
export class ReviewRequestController {
  constructor(private readonly reviewRequestService: ReviewRequestService) {}

  // CREATE Review Request
  @Roles(UserRole.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createReviewRequest(@Body() createReviewRequestDto: Partial<ReviewRequest>, @Req() req) {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user
    return await this.reviewRequestService.createReviewRequest(createReviewRequestDto, userId);
  }

  // UPDATE Review Request Status
  @Patch(':id/status')
  async updateStatus(@Param('id') id: number, @Body('resolved') resolved: boolean) {
    return await this.reviewRequestService.updateStatus(id, resolved);
  }

  // DELETE Review Request
  @Delete(':id')
  @HttpCode(204)
  async deleteReviewRequest(@Param('id') id: number) {
    return await this.reviewRequestService.deleteReviewRequest(id);
  }
}
