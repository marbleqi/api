// 外部依赖
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 内部依赖
import { SharedModule } from '@libs/shared';
import {
  RoleEntity,
  RoleLogEntity,
  UserEntity,
  UserLogEntity,
  AbilityService,
  RoleService,
  UserService,
  TokenService,
  AuthService,
  AbilityController,
  RoleController,
  UserController,
  TokenController,
} from '.';

/**访问控制模块 */
@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      RoleEntity,
      RoleLogEntity,
      UserEntity,
      UserLogEntity,
    ]),
  ],
  providers: [
    AbilityService,
    RoleService,
    UserService,
    TokenService,
    AuthService,
  ],
  controllers: [
    AbilityController,
    RoleController,
    UserController,
    TokenController,
  ],
  exports: [AbilityService, RoleService, UserService, TokenService],
})
export class AuthModule {}
