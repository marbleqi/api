// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 内部依赖
import { OperateEntity } from '..';

/**操作序号服务 */
@Injectable()
export class OperateService {
  /**
   * 构造函数
   * @param operateRepository 操作序号存储器
   */
  constructor(
    @InjectRepository(OperateEntity)
    private readonly operateRepository: Repository<OperateEntity>,
  ) {}

  /**
   * 获取新的操作序号
   * @param name 操作对象
   * @param operate 操作类型
   * @returns 新的操作序号
   */
  async create(operate: OperateEntity): Promise<number> {
    await this.operateRepository.insert(operate);
    return operate.id ? Number(operate.id) : 0;
  }
}
