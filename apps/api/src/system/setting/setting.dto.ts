// 外部依赖
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SettingDto {
  /**应用名称 */
  @ApiProperty({ description: '应用名称', example: '运维平台' })
  @IsNotEmpty({ message: '应用名称不能为空' })
  name: string;

  /**应用标题 */
  @ApiProperty({ description: '应用标题', example: '运维管理平台' })
  @IsNotEmpty({ message: '应用标题不能为空' })
  title: string;

  /**应用说明 */
  @ApiProperty({ description: '应用说明', example: '平台在手，天下我有。' })
  @IsNotEmpty({ message: '应用说明不能为空' })
  description: string;

  /**网站主体 */
  @ApiProperty({ description: '网站主体', example: '***公司' })
  @IsNotEmpty({ message: '网站主体不能为空' })
  company: string;

  /**域名 */
  @ApiProperty({ description: '域名', example: '***.com' })
  @IsNotEmpty({ message: '域名不能为空' })
  domain: string;

  /**ICP备案号 */
  @ApiProperty({ description: 'ICP备案号', example: '*ICP备*号-*' })
  @IsNotEmpty({ message: 'ICP备案号不能为空' })
  icp: string;

  /**令牌有效期 */
  @ApiProperty({ description: '令牌有效期', example: 30 })
  @IsNotEmpty({ message: '令牌有效期设置不能为空' })
  expired: number;

  /**允许密码登陆 */
  @ApiProperty({ description: '允许密码登陆', example: true })
  @IsNotEmpty({ message: '允许密码登陆设置不能为空' })
  password: boolean;

  /**允许企业微信登陆 */
  @ApiProperty({ description: '允许企业微信登陆', example: false })
  @IsNotEmpty({ message: '允许企业微信登陆设置不能为空' })
  wxwork: boolean;

  /**允许钉钉登陆 */
  @ApiProperty({ description: '允许钉钉登陆', example: false })
  @IsNotEmpty({ message: '允许钉钉登陆设置不能为空' })
  dingtalk: boolean;
}
