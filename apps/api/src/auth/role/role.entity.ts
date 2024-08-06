// 外部依赖
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
// 内部依赖
import { CreateEntity, UpdateEntity, LogEntity } from '@libs/shared';

/**角色表基类 */
export abstract class RoleBaseEntity {
  /**角色名称 */
  @Column({ type: 'text', name: 'name', default: '', comment: '角色名称' })
  name: string;

  /**角色说明 */
  @Column({
    type: 'text',
    name: 'description',
    default: '',
    comment: '角色说明',
  })
  description: string;

  /**角色授权权限点 */
  @Column({
    type: 'int',
    name: 'abilities',
    default: [],
    array: true,
    comment: '角色授权权限点',
  })
  abilities: number[];

  /**启用状态，true表示启用，false表示禁用 */
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;

  /**更新信息 */
  @Column(() => UpdateEntity)
  update: UpdateEntity;
}

/**角色表 */
@Entity('auth_roles')
export class RoleEntity extends RoleBaseEntity {
  /**角色ID */
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '角色ID' })
  id: number;

  /**创建信息 */
  @Column(() => CreateEntity)
  create: CreateEntity;
}

/**角色日志表 */
@Entity('auth_roles_logs')
export class RoleLogEntity extends RoleBaseEntity {
  /**日志信息 */
  @Column(() => LogEntity)
  log: LogEntity;

  /**角色ID */
  @Column({ type: 'int', name: 'id', comment: '角色ID' })
  @Index()
  id: number;
}
