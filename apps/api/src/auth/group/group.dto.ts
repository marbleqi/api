// 外部依赖
import {
  IsNotEmpty,
  ValidateNested,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

/**用户组信息DTO */
export class GroupDto {
  /**用户组名称 */
  @IsNotEmpty({ message: '用户组名称不能为空' })
  name: string;

  /**用户组说明 */
  @IsNotEmpty({ message: '用户组说明不能为空' })
  description: string;

  /**用户数组 */
  @IsNotEmpty({ message: '用户数组不能为空' })
  @IsArray({ message: '用户数组必须为数字数组' })
  users: number[];

  /**启用状态 */
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}
