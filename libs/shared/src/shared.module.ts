// 外部依赖
import { Module } from '@nestjs/common';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
// 内部依赖
import {
  OperateEntity,
  ReqEntity,
  SettingEntity,
  SettingLogEntity,
  SortEntity,
  SortLogEntity,
  RedisService,
  QueueService,
  OperateService,
  ReqService,
  SettingService,
  SortService,
} from '.';

/**共享模块 */
@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'shared',
      useFactory: () => {
        if (!process.env.REDIS_HOST) {
          throw new Error('队列未配置缓存地址');
        }
        /**缓存地址 */
        const host = process.env.REDIS_HOST;
        /**缓存端口 */
        const port = parseInt(process.env.REDIS_PORT, 10) || 6379;
        /**缓存库序号 */
        const db = parseInt(process.env.REDIS_DB, 10) || 0;
        /**缓存密码 */
        const password = process.env.REDIS_PSW || '';
        /**缓存配置 */
        const redis = { host, port, db, password };
        console.debug('队列缓存已连接');
        return { redis } as BullModuleOptions;
      },
    }),
    TypeOrmModule.forFeature([
      OperateEntity,
      ReqEntity,
      SettingEntity,
      SettingLogEntity,
      SortEntity,
      SortLogEntity,
    ]),
  ],
  providers: [
    RedisService,
    QueueService,
    OperateService,
    ReqService,
    SettingService,
    SortService,
  ],
  exports: [
    RedisService,
    QueueService,
    OperateService,
    ReqService,
    SettingService,
    SortService,
  ],
})
export class SharedModule {}
