// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 内部依赖
import { UpdateEntity, CommonService } from '@libs/shared';
import { MenuEntity, MenuLogEntity } from '..';

/**菜单服务 */
@Injectable()
export class MenuService extends CommonService<MenuEntity, MenuLogEntity> {
  /**
   * 构造函数
   * @param menuRepository 菜单存储器
   * @param menuLogRepository 菜单日志存储器
   */
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    @InjectRepository(MenuLogEntity)
    private readonly menuLogRepository: Repository<MenuLogEntity>,
  ) {
    super('菜单', menuRepository, menuLogRepository);
  }

  /**
   * 设置拥有权限点的菜单清单
   *
   * 根据权限点ID，设置拥有权限点的菜单ID清单
   * @param ids 需要授权的菜单ID集合
   * @param id 权限点ID
   * @param update 更新信息
   * @returns 更新记录数
   */
  async grant(
    ids: number[],
    id: number,
    update: UpdateEntity,
  ): Promise<number> {
    /**待保存数据 */
    const data: MenuEntity[] = [];
    for (const menu of Array.from(this.cache.values())) {
      // 增加菜单的权限的条件
      if (!menu.abilities.includes(id) && ids.includes(menu.id)) {
        // 增加菜单的权限
        menu.abilities.push(id);
        data.push({
          id: menu.id,
          abilities: menu.abilities,
          update,
        } as MenuEntity);
      }
      // 删除菜单的权限的条件
      if (menu.abilities.includes(id) && !ids.includes(menu.id)) {
        // 删除菜单的权限
        menu.abilities = menu.abilities.filter((item) => item !== id);
        data.push({
          id: menu.id,
          abilities: menu.abilities,
          update,
        } as MenuEntity);
      }
    }
    /**保存结果 */
    const result = await this.menuRepository.save(data);
    this.updateSub.next(Number(update.operateId));
    return result.length;
  }

  /**
   * 批量设置菜单的路由复用
   *
   * 根据新的路由复用值，批量设置菜单的路由复用值
   * @param ids 需要设置的菜单ID集合
   * @param reuse 新的路由复用值
   * @param update 更新信息
   * @returns 更新记录数
   */
  async reuse(
    ids: number[],
    reuse: boolean,
    update: UpdateEntity,
  ): Promise<number> {
    ids = Array.from(this.cache.values())
      .filter((item) => ids.includes(item.id))
      .filter((item) => item.reuse !== reuse)
      .map((item) => item.id);
    /**操作结果 */
    const result = await this.menuRepository.update(ids, {
      reuse,
      update,
    } as MenuEntity);
    if (result.affected) {
      this.updateSub.next(Number(update.operateId));
    }
    return result.affected;
  }
}
