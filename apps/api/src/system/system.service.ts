// 外部依赖
import { Injectable } from '@nestjs/common';
// 内部依赖
import { Ability, AbilityService } from '../auth';

@Injectable()
export class SystemService {
  /**
   * 构造函数
   * @param abilitySrv 权限点服务
   */
  constructor(private readonly abilitySrv: AbilityService) {
    /**通用配置信息 */
    const common = { pid: 200, moduleName: '系统', type: '对象' };
    this.abilitySrv.add({
      id: common.pid,
      pid: 0,
      name: common.moduleName,
      description: '系统管理模块',
      type: '模块',
      moduleName: common.moduleName,
    } as Ability);
    this.abilitySrv.add(
      ...[
        { id: 210, name: '设置', description: '设置管理' },
        { id: 220, name: '请求', description: '请求管理' },
        { id: 230, name: '队列', description: '队列管理' },
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
