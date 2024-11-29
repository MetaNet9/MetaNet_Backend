import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelEntity } from './entities/model.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModelEntity])],
  controllers: [ModelController],
  providers: [ModelService],
})
export class ModelModule {}
