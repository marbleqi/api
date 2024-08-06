// 外部依赖
import { Module } from '@nestjs/common';
// 内部依赖
import { SharedModule } from '@libs/shared';
import { AuthModule } from '../auth/auth.module';
import {
  SystemService,
  SettingController,
  ReqController,
  QueueController,
} from '.';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [SettingController, ReqController, QueueController],
  providers: [SystemService],
})
export class SystemModule {}
