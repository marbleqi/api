// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 内部依赖
import { CommonService } from '@libs/shared';
import { CategoryEntity, CategoryLogEntity } from '..';

/**菜单类别服务 */
@Injectable()
export class CategoryService extends CommonService<
  CategoryEntity,
  CategoryLogEntity
> {
  /**
   * 构造函数
   * @param categoryRepository 菜单类别存储器
   * @param categoryLogRepository 菜单类别日志存储器
   */
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryLogEntity)
    private readonly categoryLogRepository: Repository<CategoryLogEntity>,
  ) {
    super('菜单类别', categoryRepository, categoryLogRepository);
  }
}
