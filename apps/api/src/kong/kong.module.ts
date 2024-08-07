// 外部依赖
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
// 内部依赖
import { SharedModule } from '@libs/shared';
import { AuthModule } from '../auth/auth.module';
import {
  InstanceEntity,
  InstanceLogEntity,
  InstanceService,
  ObjectService,
  KongService,
  InstanceController,
  RouteController,
  ServiceController,
  UpstreamController,
  TargetController,
  SslController,
  PluginController,
} from '.';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    AuthModule,
    TypeOrmModule.forFeature([InstanceEntity, InstanceLogEntity]),
  ],
  providers: [InstanceService, ObjectService, KongService],
  controllers: [
    InstanceController,
    RouteController,
    ServiceController,
    UpstreamController,
    TargetController,
    SslController,
    PluginController,
  ],
})
export class KongModule {}
