// 外部依赖
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
// 内部依赖
import { CreateEntity, UpdateEntity, LogEntity } from '@libs/shared';

/**用户组基础表 */
export abstract class GroupBaseEntity {
  /**用户组名称 */
  @Column({ type: 'text', name: 'name', default: '', comment: '用户组名称' })
  name: string;

  /**用户组说明 */
  @Column({
    type: 'text',
    name: 'description',
    default: '',
    comment: '用户组说明',
  })
  description: string;

  /**归属的用户数组 */
  @Column({
    type: 'int',
    name: 'users',
    default: [],
    array: true,
    comment: '归属的用户数组',
  })
  users: number[];

  /**启用状态，true表示启用，false表示禁用 */
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;

  /**更新信息 */
  @Column(() => UpdateEntity)
  update: UpdateEntity;
}

/**用户组表 */
@Entity('auth_groups')
export class GroupEntity extends GroupBaseEntity {
  /**用户组ID */
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '用户组ID' })
  id: number;

  /**创建信息 */
  @Column(() => CreateEntity)
  create: CreateEntity;
}

/**用户组日志表 */
@Entity('auth_groups_logs')
export class GroupLogEntity extends GroupBaseEntity {
  /**日志信息 */
  @Column(() => LogEntity)
  log: LogEntity;

  /**用户组ID */
  @Column({ type: 'int', name: 'id', comment: '用户组ID' })
  @Index()
  id: number;
}
