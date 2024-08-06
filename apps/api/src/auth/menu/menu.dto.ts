// 外部依赖
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsInt,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**菜单信息DTO */
export class MenuDto {
  /**上级菜单ID */
  @ApiProperty({ description: '上级菜单ID', example: 1 })
  @IsNotEmpty({ message: '上级菜单ID不能为空' })
  @IsInt({ message: '上级菜单ID必须为数字' })
  pid: number;

  /**菜单名称 */
  @ApiProperty({ description: '菜单名称', example: '菜单名称' })
  @IsNotEmpty({ message: '菜单名称不能为空' })
  name: string;

  /**菜单说明 */
  @ApiProperty({ description: '菜单说明', example: '菜单说明' })
  @IsNotEmpty({ message: '菜单说明不能为空' })
  description: string;

  /**菜单链接 */
  @ApiProperty({ description: '菜单链接', example: '/auth/menu' })
  @IsNotEmpty({ message: '菜单链接不能为空' })
  @IsString({ message: '菜单链接必须为字符串' })
  link: string;

  /**菜单图标 */
  @ApiProperty({ description: '菜单图标', example: 'icon' })
  @IsNotEmpty({ message: '菜单图标不能为空' })
  @IsString({ message: '菜单图标必须为字符串' })
  icon: string;

  /**是否路由复用 */
  @ApiProperty({ description: '是否路由复用', example: true })
  @IsNotEmpty({ message: '是否路由复用标记不能为空' })
  @IsBoolean({ message: '是否路由复用标记必须为布尔值' })
  reuse: boolean;

  /**是否末级菜单 */
  @ApiProperty({ description: '是否末级菜单', example: true })
  @IsNotEmpty({ message: '是否末级菜单不能为空' })
  @IsBoolean({ message: '是否末级菜单标记必须为布尔值' })
  isLeaf: boolean;

  /**菜单授权权限点 */
  @ApiProperty({ description: '菜单授权权限点', example: [100, 110] })
  @IsNotEmpty({ message: '菜单授权权限点不能为空' })
  @IsArray({ message: '菜单授权权限点必须为数字数组' })
  abilities: number[];

  /**启用状态 */
  @ApiProperty({ description: '启用状态', example: true })
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}
