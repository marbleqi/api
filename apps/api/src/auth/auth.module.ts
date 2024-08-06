// 外部依赖
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 内部依赖
import { SharedModule } from '@libs/shared';
import {
  MenuEntity,
  MenuLogEntity,
  CategoryEntity,
  CategoryLogEntity,
  RoleEntity,
  RoleLogEntity,
  UserEntity,
  UserLogEntity,
  GroupEntity,
  GroupLogEntity,
  AbilityService,
  MenuService,
  CategoryService,
  RoleService,
  UserService,
  GroupService,
  TokenService,
  DashboardService,
  AuthService,
  AbilityController,
  MenuController,
  CategoryController,
  RoleController,
  UserController,
  GroupController,
  TokenController,
  DashboardController,
} from '.';

/**访问控制模块 */
@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      MenuEntity,
      MenuLogEntity,
      CategoryEntity,
      CategoryLogEntity,
      RoleEntity,
      RoleLogEntity,
      UserEntity,
      UserLogEntity,
      GroupEntity,
      GroupLogEntity,
    ]),
  ],
  providers: [
    AbilityService,
    MenuService,
    CategoryService,
    RoleService,
    UserService,
    GroupService,
    TokenService,
    DashboardService,
    AuthService,
  ],
  controllers: [
    AbilityController,
    MenuController,
    CategoryController,
    RoleController,
    UserController,
    GroupController,
    TokenController,
    DashboardController,
  ],
  exports: [
    AbilityService,
    MenuService,
    CategoryService,
    RoleService,
    UserService,
    GroupService,
    TokenService,
  ],
})
export class AuthModule {}
