// 外部依赖
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**实例信息DTO */
export class InstanceDto {
  /**实例名称 */
  @ApiProperty({ description: '实例名称', example: '开发APISIX' })
  @IsNotEmpty({ message: '实例名称不能为空' })
  name: string;

  /**实例说明 */
  @ApiProperty({ description: '实例说明', example: '开发环境APISIX' })
  @IsNotEmpty({ message: '实例说明不能为空' })
  description: string;

  /**接口地址 */
  @ApiProperty({ description: '接口地址', example: 'http://127.0.0.1:9080' })
  @IsNotEmpty({ message: '接口地址不能为空' })
  url: string;

  /**启用状态 */
  @ApiProperty({ description: '启用状态', example: true })
  @IsNotEmpty({ message: '启用状态不能为空' })
  status: boolean;
}
