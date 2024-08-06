// 外部依赖
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
// 内部依赖
import { CreateEntity, UpdateEntity, LogEntity } from '@libs/shared';

/**菜单类别表基类 */
export abstract class CategoryBaseEntity {
  /**菜单类别名称 */
  @Column({ type: 'text', name: 'name', default: '', comment: '菜单类别名称' })
  name: string;

  /**菜单类别说明 */
  @Column({
    type: 'text',
    name: 'description',
    default: '',
    comment: '菜单类别说明',
  })
  description: string;

  /**归类的菜单数组 */
  @Column({
    type: 'int',
    name: 'menus',
    default: [],
    array: true,
    comment: '归类的菜单数组',
  })
  menus: number[];

  /**启用状态，true表示启用，false表示禁用 */
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;

  /**更新信息 */
  @Column(() => UpdateEntity)
  update: UpdateEntity;
}

/**菜单类别表 */
@Entity('auth_categories')
export class CategoryEntity extends CategoryBaseEntity {
  /**菜单类别ID */
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '菜单类别ID' })
  id: number;

  /**创建信息 */
  @Column(() => CreateEntity)
  create: CreateEntity;
}

/**菜单类别日志表 */
@Entity('auth_categories_logs')
export class CategoryLogEntity extends CategoryBaseEntity {
  /**日志信息 */
  @Column(() => LogEntity)
  log: LogEntity;

  /**菜单类别ID */
  @Column({ type: 'int', name: 'id', comment: '菜单类别ID' })
  @Index()
  id: number;
}
