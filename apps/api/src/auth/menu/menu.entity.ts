// 外部依赖
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// 内部依赖
import { CreateEntity, UpdateEntity, LogEntity } from '@libs/shared';

/**菜单表基类 */
export abstract class MenuBaseEntity {
  /**上级菜单ID */
  @ApiProperty({ description: '上级菜单ID', example: 0 })
  @Column({ type: 'int', name: 'pid', default: 0, comment: '上级菜单ID' })
  pid: number;

  /**菜单名称 */
  @ApiProperty({ description: '菜单名称', example: '菜单名称' })
  @Column({ type: 'text', name: 'name', default: '', comment: '菜单名称' })
  name: string;

  /**菜单说明 */
  @ApiProperty({ description: '菜单说明', example: '菜单说明' })
  @Column({
    type: 'text',
    name: 'description',
    default: '',
    comment: '菜单说明',
  })
  description: string;

  /**菜单链接 */
  @ApiProperty({ description: '菜单链接', example: '/auth/menu' })
  @Column({ type: 'text', name: 'link', default: '', comment: '菜单链接' })
  link: string;

  /**菜单图标 */
  @ApiProperty({ description: '菜单图标', example: 'icon' })
  @Column({ type: 'text', name: 'icon', default: '', comment: '菜单图标' })
  icon: string;

  /**是否路由复用 */
  @ApiProperty({ description: '是否路由复用', example: true })
  @Column({
    type: 'bool',
    name: 'reuse',
    default: true,
    comment: '是否路由复用',
  })
  reuse: boolean;

  /**是否末级菜单 */
  @ApiProperty({ description: '是否末级菜单', example: true })
  @Column({
    type: 'bool',
    name: 'isLeaf',
    default: true,
    comment: '是否末级菜单',
  })
  isLeaf: boolean;

  /**菜单授权权限点 */
  @ApiProperty({ description: '菜单授权权限点', example: [100, 110] })
  @Column({
    type: 'int',
    name: 'abilities',
    default: [],
    array: true,
    comment: '菜单授权权限点',
  })
  abilities: number[];

  /**启用状态，true表示启用，false表示禁用 */
  @ApiProperty({ description: '启用状态', example: true })
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;

  /**更新信息 */
  @ApiProperty({ description: '更新信息' })
  @Column(() => UpdateEntity)
  update: UpdateEntity;
}

/**菜单表 */
@Entity('auth_menus')
export class MenuEntity extends MenuBaseEntity {
  /**菜单ID */
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '菜单ID' })
  id: number;

  /**创建信息 */
  @Column(() => CreateEntity)
  create: CreateEntity;
}

/**菜单日志表 */
@Entity('auth_menus_logs')
export class MenuLogEntity extends MenuBaseEntity {
  /**日志信息 */
  @Column(() => LogEntity)
  log: LogEntity;

  /**菜单ID */
  @Column({ type: 'int', name: 'id', comment: '菜单ID' })
  @Index()
  id: number;
}
