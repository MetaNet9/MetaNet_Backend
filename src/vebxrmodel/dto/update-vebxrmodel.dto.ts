import { PartialType } from '@nestjs/mapped-types';
import { CreateVebxrmodelDto } from './create-vebxrmodel.dto';

export class UpdateVebxrmodelDto extends PartialType(CreateVebxrmodelDto) {}
