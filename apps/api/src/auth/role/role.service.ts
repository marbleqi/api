// 外部依赖
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 内部依赖
import {
  CreateEntity,
  UpdateEntity,
  OperateEntity,
  OperateService,
  CommonService,
} from '@libs/shared';
import { RoleEntity, RoleLogEntity } from '..';

/**角色服务 */
@Injectable()
export class RoleService extends CommonService<RoleEntity, RoleLogEntity> {
  /**
   * 构造函数
   * @param roleRepository 角色存储器
   * @param roleLogRepository 角色日志存储器
   */
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(RoleLogEntity)
    private readonly roleLogRepository: Repository<RoleLogEntity>,
    private readonly operateSrv: OperateService,
  ) {
    super('角色', roleRepository, roleLogRepository);
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    // 缓存同步
    await this.sync();
    // 如果没有角色，则执行角色数据的初始化
    if (!this.cache.size) {
      /**当前时间 */
      const at = Date.now();
      /**操作序号 */
      const operateId = await this.operateSrv.create({
        name: 'auth/role',
        operate: 'create',
        at,
      } as OperateEntity);
      /**新角色超级管理员 */
      const role = {
        name: '超级管理员',
        description: '超级管理员',
        status: true,
        abilities: [
          100, 110, 111, 112, 120, 121, 122, 123, 124, 125, 130, 131, 132, 133,
          134, 135, 140, 141, 142, 143, 144, 145, 150, 151, 152, 153, 154, 155,
          156, 157, 160, 161, 162, 163, 164, 165, 170, 171, 176,
        ],
        create: { userId: 1, at } as CreateEntity,
        update: {
          userId: 1,
          at,
          operateId,
          operate: 'create',
          reqId: 0,
        } as UpdateEntity,
      } as RoleEntity;
      await this.create(role);
    }
  }

  /**
   * 设置拥有权限点的角色清单
   *
   * 根据权限点ID，设置拥有权限点的角色ID清单
   * @param id 权限点ID
   * @param ids 需要授权的角色ID集合
   * @param update 更新信息
   * @returns 更新记录数
   */
  async grant(
    ids: number[],
    id: number,
    update: UpdateEntity,
  ): Promise<number> {
    /**待保存数据 */
    const data: RoleEntity[] = [];
    for (const role of Array.from(this.cache.values())) {
      // 增加角色的权限的条件
      if (!role.abilities.includes(id) && ids.includes(role.id)) {
        // 增加角色的权限
        role.abilities.push(id);
        data.push({
          id: role.id,
          abilities: role.abilities,
          update,
        } as RoleEntity);
      }
      // 删除角色的权限的条件
      if (role.abilities.includes(id) && !ids.includes(role.id)) {
        // 删除角色的权限
        role.abilities = role.abilities.filter((item) => item !== id);
        data.push({
          id: role.id,
          abilities: role.abilities,
          update,
        } as RoleEntity);
      }
    }
    /**保存结果 */
    const result = await this.roleRepository.save(data);
    this.updateSub.next(Number(update.operateId));
    return result.length;
  }
}
