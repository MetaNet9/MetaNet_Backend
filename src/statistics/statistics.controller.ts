import { Controller, Get } from '@nestjs/common';
import { VebxrmodelService } from 'src/vebxrmodel/vebxrmodel.service';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async getStatistics() {
    return this.statisticsService.getStatistics();
  }
}
