// 外部依赖
import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
// 内部依赖
import {
  Operate,
  Name,
  CreateEntity,
  UpdateEntity,
  SortEntity,
  SettingEntity,
  SortService,
  SettingService,
  OperatePipe,
  CommonController,
} from '@libs/shared';
import { Ability, Abilities, AbilityService } from '../../auth';
import { SettingDto } from '..';

@Controller('system/setting')
@ApiTags('系统管理-系统配置')
export class SettingController extends CommonController {
  /**
   * 构造函数
   * @param ability 注入的权限点服务
   * @param setting 注入的配置服务
   */

  constructor(
    private readonly abilitySrv: AbilityService,
    private readonly setting: SettingService,
  ) {
    super();
    this.abilitySrv.add(
      ...[
        { id: 213, name: '查看配置', description: '查看系统配置' },
        { id: 215, name: '修改配置', description: '修改系统配置' },
      ].map(
        (item) =>
          ({
            pid: 210,
            moduleName: '系统',
            objectName: '配置',
            type: '接口',
            ...item,
          }) as Ability,
      ),
    );
  }

  /**
   * 获取系统配置
   * @param res 响应上下文
   */
  @Get('show')
  @ApiOperation({ summary: '获取系统配置' })
  @ApiOkResponse({ description: '获取系统配置成功', type: SettingEntity })
  @Abilities(213)
  private async show(@Res() res: Response): Promise<void> {
    /**配置对象 */
    res.locals.result = await this.setting.show('system');
  }

  /**
   * 设置系统配置
   * @param value 提交消息体
   * @param res 响应上下文
   */
  @Post()
  @ApiOperation({ summary: '设置系统配置' })
  @ApiBody({ type: SettingDto })
  @Abilities(215)
  private async set(
    @Body() value: SettingDto,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.setting.update({
      code: 'system',
      value,
      create: res.locals.create as CreateEntity,
      update: res.locals.update as UpdateEntity,
    } as SettingEntity);
  }
}
