import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AdminController } from './admin/admin.controller';
import { ModeratorManageController } from './moderator-manage/moderator-manage.controller';
import { ModeratorManageService } from './moderator-manage/moderator-manage.service';
import { ModeratorManageModule } from './moderator-manage/moderator-manage.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { VebxrmodelModule } from './vebxrmodel/vebxrmodel.module';
import { Vebxrmodel } from './vebxrmodel/entities/vebxrmodel.entity';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'metanet',
      entities: [User, Vebxrmodel],
      synchronize: true,
    }),
    AuthModule,
    ConfigModule.forRoot(),
    ModeratorManageModule,
    VebxrmodelModule,
    FileUploadModule
  ],
  
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  
  controllers: [ AdminController],
})
export class AppModule {}
