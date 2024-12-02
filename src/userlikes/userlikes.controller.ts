import { Controller, Post, Delete, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UserLikesService } from './userlikes.service'; 
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('likes')
export class UserLikesController {
  constructor(private readonly userLikesService: UserLikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':modelId')
  async likeModel(
    @Req() req,
    @Param('modelId', ParseIntPipe) modelId: number,
  ): Promise<string> {
    const userId = req.user.userId;
    return this.userLikesService.likeModel(userId, modelId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':modelId')
  async unlikeModel(
    @Req() req,
    @Param('modelId', ParseIntPipe) modelId: number,
  ): Promise<string> {
    const userId = req.user.userId;
    return this.userLikesService.unlikeModel(userId, modelId);
  }
}
