// 外部依赖
import { IsNotEmpty, IsArray } from 'class-validator';

/**菜单类别信息DTO */
export class CategoryDto {
  /**菜单类别名称 */
  @IsNotEmpty({ message: '菜单类别名称不能为空' })
  name: string;

  /**菜单类别说明 */
  @IsNotEmpty({ message: '菜单类别说明不能为空' })
  description: string;

  /**归类的菜单数组 */
  @IsNotEmpty({ message: '归类的菜单数组不能为空' })
  @IsArray({ message: '归类的菜单数组必须为数字数组' })
  menus: number[];

  /**启用状态 */
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}
