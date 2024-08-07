// 外部依赖
import { Injectable } from '@nestjs/common';
// 内部依赖
import { Ability, AbilityService } from '../auth';

@Injectable()
export class KongService {
  /**
   * 构造函数
   * @param abilitySrv 权限点服务
   */
  constructor(private readonly abilitySrv: AbilityService) {
    /**通用配置信息 */
    const common = { pid: 500, moduleName: 'APISIX', type: '对象' };
    this.abilitySrv.add({
      id: common.pid,
      pid: 0,
      name: common.moduleName,
      description: 'APISIX模块',
      type: '模块',
      moduleName: common.moduleName,
    } as Ability);
    this.abilitySrv.add(
      ...[
        { id: 510, name: '实例', description: '实例管理' },
        { id: 520, name: '路由', description: '路由管理' },
        { id: 530, name: '上游', description: '上游管理' },
        { id: 540, name: '服务', description: '服务管理' },
        { id: 550, name: '消费者', description: '消费者管理' },
        { id: 560, name: 'Proto', description: 'Proto管理' },
        { id: 570, name: '插件', description: '插件管理' },
        { id: 580, name: '证书', description: '证书管理' },
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
