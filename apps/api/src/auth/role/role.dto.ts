// 外部依赖
import { IsNotEmpty, IsDefined, IsArray } from 'class-validator';

/**角色信息DTO */
export class RoleDto {
  /**角色名称 */
  @IsDefined()
  @IsNotEmpty({ message: '角色名称不能为空' })
  name: string;

  /**角色说明 */
  @IsDefined()
  @IsNotEmpty({ message: '角色说明不能为空' })
  description: string;

  /**角色授权权限点 */
  @IsDefined()
  @IsNotEmpty({ message: '角色授权权限点不能为空' })
  @IsArray({ message: '角色授权权限点必须为数字数组' })
  abilities: number[];

  /**启用状态 */
  @IsDefined()
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}
