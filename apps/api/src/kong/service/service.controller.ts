// 外部依赖
import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
// 内部依赖
import {
  Operate,
  Name,
  CreateEntity,
  UpdateEntity,
  SortEntity,
  SortService,
  OperatePipe,
  CommonController,
} from '@libs/shared';
import { Ability, Abilities, AbilityService } from '../../auth';
import { ObjectService } from '..';

/**服务控制器 */
@Controller('kong/service')
export class ServiceController extends CommonController {
  /**
   * 构造函数
   * @param abilityService 注入的权限点路由
   * @param objectService 注入的对象路由
   */
  constructor(
    private readonly abilitySrv: AbilityService,
    private readonly objectService: ObjectService,
  ) {
    super();
    this.abilitySrv.add(
      ...[
        { id: 521, name: '路由列表', description: '查看路由列表' },
        { id: 522, name: '路由详情', description: '查看路由详情' },
        { id: 523, name: '路由历史', description: '路由更新历史' },
        { id: 524, name: '创建路由', description: '创建新的路由' },
        { id: 525, name: '修改路由', description: '修改已有的路由' },
      ].map(
        (item) =>
          ({
            pid: 520,
            moduleName: 'APISIX',
            objectName: '路由',
            type: '接口',
            ...item,
          }) as Ability,
      ),
    );
  }

  /**
   * 获取路由清单
   * @param hostId 站点ID
   * @param res 响应上下文
   */
  @Get(':instanceId/list')
  async list(
    @Param('instanceId', new ParseIntPipe()) instanceId: number,
    @Res() res: Response,
  ) {
    res.locals.result = await this.objectService.list(instanceId, 'services');
  }

  @Get(':instanceId/get/:id')
  async get(
    @Param('instanceId', new ParseIntPipe()) instanceId: number,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    res.locals.result = await this.objectService.get(
      instanceId,
      'services',
      id,
    );
  }

  /**
   * 创建用户
   * @param value 新用户信息
   * @param res 响应上下文
   */
  @Post(':instanceId/create')
  @Name('kong/service')
  @Operate('create')
  private async create(
    @Param('instanceId', new ParseIntPipe()) instanceId: number,
    @Body() value: any,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.objectService.create(
      instanceId,
      'services',
      value,
    );
  }

  /**
   * 更新用户（含禁用）
   * @param user 现用户信息
   * @param value 新用户信息
   * @param res 响应上下文
   */
  @Post(':instanceId/update/:id')
  @Name('kong/service')
  @Operate('update')
  private async update(
    @Param('instanceId', new ParseIntPipe()) instanceId: number,
    @Param('id') id: string,
    @Body() value: any,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.objectService.update(
      instanceId,
      'services',
      id,
      value,
    );
  }

  /**
   * 更新用户（含禁用）
   * @param user 现用户信息
   * @param value 新用户信息
   * @param res 响应上下文
   */
  @Delete(':instanceId/distory/:id')
  @Name('kong/service')
  @Operate('distory')
  private async distory(
    @Param('instanceId', new ParseIntPipe()) instanceId: number,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.objectService.distory(
      instanceId,
      'services',
      id,
    );
  }
}
