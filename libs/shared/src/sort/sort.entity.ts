// 外部依赖
import { Entity, Column, PrimaryColumn } from 'typeorm';
// 内部依赖
import { CreateEntity, UpdateEntity, LogEntity } from '..';

/**配置基类表 */
export abstract class SortBaseEntity {
  /**状态，true表示可用，false表示禁用 */
  @Column({ type: 'bool', name: 'status', default: true, comment: '状态' })
  status: boolean;

  /**排序数据 */
  @Column({ type: 'int', name: 'value', comment: '排序数据', array: true })
  value: number[];

  @Column(() => UpdateEntity)
  update: UpdateEntity;
}

/**排序数据表 */
@Entity('sys_sorts')
export class SortEntity extends SortBaseEntity {
  /**排序对象名称 */
  @PrimaryColumn({ type: 'text', name: 'name', comment: '排序对象名称' })
  name: string;

  /**创建信息 */
  @Column(() => CreateEntity)
  create: CreateEntity;
}

/**排序日志表 */
@Entity('sys_sorts_logs')
export class SortLogEntity extends SortBaseEntity {
  /**日志信息 */
  @Column(() => LogEntity)
  log: LogEntity;

  /**排序对象名称 */
  @Column({ type: 'text', name: 'name', comment: '排序对象名称' })
  name: string;
}
