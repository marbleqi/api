// 外部依赖
import { IsNotEmpty, IsArray } from 'class-validator';
// 内部依赖
import { UserConfig } from '..';

/**用户信息DTO */
export class UserDto {
  /**登陆名 */
  @IsNotEmpty({ message: '登陆名不能为空' })
  loginName: string;

  /**姓名 */
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

  /**头像URL */
  avatar?: string;

  /**电子邮箱 */
  email?: string;

  /**用户配置 */
  @IsNotEmpty({ message: '用户配置不能为空' })
  config: UserConfig;

  /**用户授权角色 */
  @IsNotEmpty({ message: '用户授权角色不能为空' })
  @IsArray({ message: '用户的授权角色必须为数字数组' })
  roles: number[];

  /**用户配置 */
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}
