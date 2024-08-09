import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ModelService } from './model/model.service';
import { ModelController } from './model/model.controller';
import { AdminController } from './admin/admin.controller';
import { ModeratorManageController } from './moderator-manage/moderator-manage.controller';
import { ModeratorManageService } from './moderator-manage/moderator-manage.service';
import { ModeratorManageModule } from './moderator-manage/moderator-manage.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'metanet',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    ConfigModule.forRoot(),
    ModeratorManageModule
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
    ModelService
  ],
  
  controllers: [ModelController, AdminController],
})
export class AppModule {}
