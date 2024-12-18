import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { VebxrmodelService } from './vebxrmodel.service';
import { CreateVebxrmodelDto } from './dto/create-vebxrmodel.dto';
import { UpdateVebxrmodelDto } from './dto/update-vebxrmodel.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Vebxrmodel } from './entities/vebxrmodel.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.entity';
import { AskFromAIDto } from './dto/ask-from-ai.dto';

@Controller('vebxrmodel')
export class VebxrmodelController {
  constructor(private readonly vebxrmodelService: VebxrmodelService) {}

  @Roles(UserRole.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createVebxrmodelDto: CreateVebxrmodelDto, @Req() req) {
    return this.vebxrmodelService.create(createVebxrmodelDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.vebxrmodelService.findAll();
  }

  // get query from body and ask from ai
  @Post('searchwithAi')
  searchWithAI(@Body() query) {
    console.log('query', query.query);
    return this.vebxrmodelService.searchWithAI(query.query);
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVebxrmodelDto: UpdateVebxrmodelDto) {
  //   return this.vebxrmodelService.update(+id, updateVebxrmodelDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.vebxrmodelService.remove(+id);
  // }

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

  @UseGuards(JwtAuthGuard)
  @Get('modelsWithLikes')
  async findWithFiltersgetLikes(
    @Req() req,
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
    @Query('keyword') keyword?: any,
  ): Promise<{ data: Vebxrmodel[]; total: any }> {

    const userId = req.user.userId;

    const filters = {
      category: category && !isNaN(parseInt(category, 10)) ? parseInt(category, 10) : undefined,
      minPrice: minPrice && !isNaN(parseFloat(minPrice)) ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice && !isNaN(parseFloat(maxPrice)) ? parseFloat(maxPrice) : undefined,
      format,
      license,
      keyword,
      pbr: pbr === 'true',
      animated: animated === 'true',
      rigged: rigged === 'true',
    };

    return this.vebxrmodelService.findWithFiltersandLikes(filters, userId, page, pageSize);
  }

  @Get('modelsWithSellers')
  findSellerModels() {
    return this.vebxrmodelService.getFormattedModels();
  }

  @Post('askfromai')
  askFromAI(@Body() askFromAIDto: AskFromAIDto) {
    const { question, modelId } = askFromAIDto;
    return this.vebxrmodelService.askFromAI(question, modelId);
  }

  // get a model by id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneId( @Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.vebxrmodelService.findModel(+id, userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.vebxrmodelService.findOne(+id);
  // }

}
