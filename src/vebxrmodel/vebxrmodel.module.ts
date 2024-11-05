import { Module } from '@nestjs/common';
import { VebxrmodelService } from './vebxrmodel.service';
import { VebxrmodelController } from './vebxrmodel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vebxrmodel } from './entities/vebxrmodel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vebxrmodel])],
  controllers: [VebxrmodelController],
  providers: [VebxrmodelService],
})
export class VebxrmodelModule {}
