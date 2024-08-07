// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 内部依赖
import { CommonService } from '@libs/shared';
import { InstanceEntity, InstanceLogEntity } from '..';

@Injectable()
export class InstanceService extends CommonService<
  InstanceEntity,
  InstanceLogEntity
> {
  /**
   * 构造函数
   * @param userRepository 角色存储器
   * @param userLogRepository 角色日志存储器
   * @param roleSrv 角色服务
   */
  constructor(
    @InjectRepository(InstanceEntity)
    public readonly instanceRepository: Repository<InstanceEntity>,
    @InjectRepository(InstanceLogEntity)
    private readonly instanceLogRepository: Repository<InstanceLogEntity>,
  ) {
    super('实例', instanceRepository, instanceLogRepository);
  }
}
