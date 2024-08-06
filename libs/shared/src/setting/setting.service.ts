// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 内部依赖
import {
  CreateEntity,
  UpdateEntity,
  OperateEntity,
  SettingEntity,
  SettingLogEntity,
  QueueService,
  OperateService,
  OptionService,
} from '..';

/**配置服务 */
@Injectable()
export class SettingService extends OptionService<
  SettingEntity,
  SettingLogEntity
> {
  /**
   * 构造函数
   * @param settingRepository 配置存储器
   * @param settingLogRepository 配置日志存储器
   */
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,
    @InjectRepository(SettingLogEntity)
    private readonly settingLogRepository: Repository<SettingLogEntity>,
    private readonly queueSrv: QueueService,
    private readonly operateSrv: OperateService,
  ) {
    super('code', settingRepository, settingLogRepository);
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    // 订阅后端消息
    this.queueSrv.apiSub.subscribe(async (res) => {
      console.debug('收到消息', res);
      if (res.name === 'setting') {
        console.debug('缓存同步开始');
        await this.sync();
        console.debug('缓存同步结束，通知前端更新');
        this.queueSrv.webSub.next(res);
      }
    });
    // 缓存同步
    await this.sync();
    // 如果未配置系统参数，则配置系统参数
    if (!this.cache.has('system')) {
      /**当前时间 */
      const at = Date.now();
      /**操作序号 */
      const operateId = await this.operateSrv.create({
        name: 'system/setting',
        operate: 'create',
        at,
      } as OperateEntity);
      const setting = {
        code: 'system',
        value: {
          name: '运维平台',
          title: '运维平台',
          description: '平台在手，天下我有。',
          company: '***公司',
          domain: '***.com',
          icp: '*ICP备*号-*',
          expired: 30,
          password: true,
          wxwork: false,
          dingtalk: false,
        },
        create: { userId: 1, at } as CreateEntity,
        update: {
          userId: 1,
          at,
          operateId,
          operate: 'create',
          reqId: 0,
        } as UpdateEntity,
      } as SettingEntity;
      // 保存系统配置
      await this.update(setting);
    }
  }
}
