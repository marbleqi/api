// 外部依赖
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
// 内部依赖
import { CreateEntity, UpdateEntity, LogEntity } from '@libs/shared';

/**实例表基类 */
export abstract class InstanceBaseEntity {
  /**实例名称 */
  @Column({ type: 'text', name: 'name', default: '', comment: '实例名称' })
  name: string;

  /**实例说明 */
  @Column({
    type: 'text',
    name: 'description',
    default: '',
    comment: '实例说明',
  })
  description: string;

  /**接口地址 */
  @Column({ type: 'text', name: 'url', default: '', comment: '接口地址' })
  url: string;

  /**启用状态，true表示启用，false表示禁用 */
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;

  /**更新信息 */
  @Column(() => UpdateEntity)
  update: UpdateEntity;
}

/**实例表 */
@Entity('kong_instances')
export class InstanceEntity extends InstanceBaseEntity {
  /**实例ID */
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '实例ID' })
  id: number;

  /**创建信息 */
  @Column(() => CreateEntity)
  create: CreateEntity;
}

/**实例日志表 */
@Entity('kong_instances_logs')
export class InstanceLogEntity extends InstanceBaseEntity {
  /**日志信息 */
  @Column(() => LogEntity)
  log: LogEntity;

  /**实例ID */
  @Column({ type: 'int', name: 'id', comment: '实例ID' })
  @Index()
  id: number;
}
