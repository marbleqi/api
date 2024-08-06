// 外部依赖
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  AfterLoad,
} from 'typeorm';
// 内部依赖
import { CreateEntity, UpdateEntity, LogEntity } from '@libs/shared';
import { UserConfig } from '..';

/**用户表基类 */
export abstract class UserBaseEntity {
  /**登陆名 */
  @Column({ type: 'text', name: 'login_name', comment: '登陆名' })
  loginName: string;

  /**姓名 */
  @Column({ type: 'text', name: 'name', default: '', comment: '姓名' })
  name: string;

  /**头像URL */
  @Column({ type: 'text', name: 'avatar', default: '', comment: '头像URL' })
  avatar: string;

  /**电子邮箱 */
  @Column({ type: 'text', name: 'email', default: '', comment: '电子邮箱' })
  email: string;

  /**用户密码 */
  @Column({ type: 'text', name: 'password', default: '', comment: '用户密码' })
  password: string;

  /**用户配置 */
  @Column({ type: 'json', name: 'config', comment: '用户配置' })
  config: UserConfig;

  /**用户授权角色 */
  @Column({
    type: 'int',
    name: 'roles',
    default: [],
    array: true,
    comment: '用户授权角色',
  })
  roles: number[];

  /**启用状态，true表示启用，false表示禁用 */
  @Column({ type: 'bool', name: 'status', default: true, comment: '启用状态' })
  status: boolean;

  /**锁定状态，true表示锁定，false表示未锁定 */
  @Column({ type: 'bool', name: 'locked', default: false, comment: '锁定状态' })
  locked: boolean;

  /**更新信息 */
  @Column(() => UpdateEntity)
  update: UpdateEntity;
}

/**用户表，增加登陆名字段为唯一性索引 */
@Entity('auth_users')
export class UserEntity extends UserBaseEntity {
  /**用户ID */
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '用户ID' })
  id: number;

  /**创建信息 */
  @Column(() => CreateEntity)
  create: CreateEntity;

  /**密码错误次数 */
  @Column({
    type: 'int',
    name: 'psw_times',
    default: 0,
    comment: '密码错误次数',
  })
  pswTimes: number;

  /**登陆次数 */
  @Column({ type: 'int', name: 'login_times', default: 0, comment: '登陆次数' })
  loginTimes: number;

  /**首次登录时间 */
  @Column({
    type: 'bigint',
    name: 'first_login_at',
    default: 0,
    comment: '首次登录时间',
  })
  firstLoginAt: number;

  /**最后登录IP */
  @Column({
    type: 'inet',
    name: 'last_login_ip',
    default: '127.0.0.1',
    comment: '最后登录IP',
  })
  lastLoginIp: string;

  /**最后登录时间 */
  @Column({
    type: 'bigint',
    name: 'last_login_at',
    default: 0,
    comment: '最后登录时间',
  })
  lastLoginAt: number;

  /**最后会话时间 */
  @Column({
    type: 'bigint',
    name: 'last_session_at',
    default: 0,
    comment: '最后会话时间',
  })
  lastSessionAt: number;

  /**对长整型数据返回时，进行数据转换 */
  @AfterLoad()
  userLoad() {
    this.firstLoginAt = this.firstLoginAt ? Number(this.firstLoginAt) : 0;
    this.lastLoginAt = this.lastLoginAt ? Number(this.lastLoginAt) : 0;
    this.lastSessionAt = this.lastSessionAt ? Number(this.lastSessionAt) : 0;
  }
}

/**用户日志表 */
@Entity('auth_users_logs')
export class UserLogEntity extends UserBaseEntity {
  /**日志信息 */
  @Column(() => LogEntity)
  log: LogEntity;

  /**用户ID */
  @Column({ type: 'int', name: 'id', comment: '用户ID' })
  @Index()
  id: number;
}
