import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { VebxrmodelService } from './vebxrmodel.service';
import { CreateVebxrmodelDto } from './dto/create-vebxrmodel.dto';
import { UpdateVebxrmodelDto } from './dto/update-vebxrmodel.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Vebxrmodel } from './entities/vebxrmodel.entity';

@Controller('vebxrmodel')
export class VebxrmodelController {
  constructor(private readonly vebxrmodelService: VebxrmodelService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createVebxrmodelDto: CreateVebxrmodelDto, @Req() req) {
    return this.vebxrmodelService.create(createVebxrmodelDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.vebxrmodelService.findAll();
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVebxrmodelDto: UpdateVebxrmodelDto) {
  //   return this.vebxrmodelService.update(+id, updateVebxrmodelDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vebxrmodelService.remove(+id);
  }

  @Get('findWithFilters')
  async findWithFilters(
    @Query('category') category?: any,
    @Query('minPrice') minPrice?: any,
    @Query('maxPrice') maxPrice?: any,
    @Query('format') format?: any,
    @Query('license') license?: any,
    @Query('pbr') pbr?: any,
    @Query('animated') animated?: any,
    @Query('rigged') rigged?: any,
    @Query('page') page: any = 1,
    @Query('pageSize') pageSize: any = 10,
  ): Promise<{ data: Vebxrmodel[]; total: any }> {

    const filters = {
      category: category && !isNaN(parseInt(category, 10)) ? parseInt(category, 10) : undefined,
      minPrice: minPrice && !isNaN(parseFloat(minPrice)) ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice && !isNaN(parseFloat(maxPrice)) ? parseFloat(maxPrice) : undefined,
      format,
      license,
      pbr: pbr === 'true',
      animated: animated === 'true',
      rigged: rigged === 'true',
    };

    return this.vebxrmodelService.findWithFilters(filters, page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vebxrmodelService.findOne(+id);
  }

}
