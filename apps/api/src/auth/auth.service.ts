// 外部依赖
import { Injectable } from '@nestjs/common';
// 内部依赖
import { Ability, AbilityService } from '.';

/**访问控制服务 */
@Injectable()
export class AuthService {
  /**
   * 构造函数
   * @param abilitySrv 权限点服务
   */
  constructor(private readonly abilitySrv: AbilityService) {
    /**通用配置信息 */
    const common = { pid: 100, moduleName: '访问控制', type: '对象' };
    this.abilitySrv.add({
      id: common.pid,
      pid: 0,
      name: common.moduleName,
      description: '访问控制模块',
      type: '模块',
      moduleName: common.moduleName,
    } as Ability);
    this.abilitySrv.add(
      ...[
        { id: 110, name: '权限点', description: '权限点管理' },
        { id: 120, name: '菜单', description: '菜单管理' },
        { id: 130, name: '菜单类别', description: '菜单类别管理' },
        { id: 140, name: '角色', description: '角色管理' },
        { id: 150, name: '用户', description: '用户管理' },
        { id: 160, name: '用户组', description: '用户组管理' },
        { id: 170, name: '令牌', description: '令牌管理' },
        { id: 180, name: '仪表板', description: '仪表板管理' },
      ].map(
        (item) =>
          ({
            ...common,
            ...item,
            objectName: item.name,
          }) as Ability,
      ),
    );
  }
}
