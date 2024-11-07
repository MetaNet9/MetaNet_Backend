import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { VebxrmodelService } from './vebxrmodel.service';
import { CreateVebxrmodelDto } from './dto/create-vebxrmodel.dto';
import { UpdateVebxrmodelDto } from './dto/update-vebxrmodel.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vebxrmodelService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVebxrmodelDto: UpdateVebxrmodelDto) {
  //   return this.vebxrmodelService.update(+id, updateVebxrmodelDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vebxrmodelService.remove(+id);
  }
}
