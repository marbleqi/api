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
  SortService,
  OperatePipe,
  CommonController,
} from '@libs/shared';
import { Ability, Abilities, AbilityService } from '../../auth';
import { InstanceDto, InstanceEntity, InstanceService } from '..';

@Controller('kong/instance')
export class InstanceController extends CommonController {
  /**
   * 构造函数
   * @param sortSrv 排序服务
   * @param abilitySrv 权限点服务
   * @param instanceSrv 实例服务
   */
  constructor(
    private readonly sortSrv: SortService,
    private readonly abilitySrv: AbilityService,
    private readonly instanceSrv: InstanceService,
  ) {
    super();
    this.abilitySrv.add(
      ...[
        { id: 511, name: '实例列表', description: '查看实例列表' },
        { id: 512, name: '实例详情', description: '查看实例详情' },
        { id: 513, name: '实例历史', description: '实例更新历史' },
        { id: 514, name: '创建实例', description: '创建新的实例' },
        { id: 515, name: '修改实例', description: '修改已有的实例' },
      ].map(
        (item) =>
          ({
            pid: 510,
            moduleName: 'APISIX',
            objectName: '实例',
            type: '接口',
            ...item,
          }) as Ability,
      ),
    );
  }

  /**
   * 获取实例清单
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('index')
  @ApiOperation({ summary: '获取实例清单' })
  @ApiQuery({ name: 'operateId', description: '操作序号', example: 0 })
  @ApiOkResponse({ description: '获取实例清单成功', type: [InstanceEntity] })
  @Abilities(141)
  private async index(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.instanceSrv.index(operateId);
    console.debug('res.locals.result', res.locals.result);
  }

  /**
   * 获取实例排序
   * @param res 响应上下文
   */
  @Get('sort')
  @ApiOperation({ summary: '获取实例排序' })
  @Abilities(141)
  private sorted(@Res() res: Response): void {
    res.locals.result = this.sortSrv.get('auth/group');
  }

  /**
   * 获取实例详情
   * @param instance 现实例信息
   * @param res 响应上下文
   */
  @Get('show/:id')
  @ApiOperation({ summary: '获取实例详情' })
  @Abilities(141)
  private async show(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.instanceSrv.show(id);
  }

  /**
   * 获取实例变更日志
   * @param instance 现实例信息
   * @param res 响应上下文
   */
  @Get('log/:id')
  @ApiOperation({ summary: '获取实例变更日志' })
  @Abilities(141)
  private async log(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.instanceSrv.log(id);
  }

  /**
   * 创建实例
   * @param value 提交消息体
   * @param res 响应上下文
   */
  @Post('create')
  @ApiOperation({ summary: '创建实例' })
  @ApiBody({ type: InstanceDto })
  @Abilities(141)
  @Name('nacos/instance')
  @Operate('create')
  private async create(@Body() value: InstanceDto, @Res() res: Response) {
    res.locals.result = await this.instanceSrv.create({
      ...value,
      create: res.locals.create as CreateEntity,
      update: res.locals.update as UpdateEntity,
    } as InstanceEntity);
  }

  /**
   * 更新实例（含禁用）
   * @param instance 现实例信息
   * @param value 提交消息体
   * @param res 响应上下文
   */
  @Post('update/:id')
  @ApiOperation({ summary: '更新实例' })
  @ApiParam({ name: 'id', description: '实例ID', example: 1 })
  @ApiQuery({})
  @ApiBody({ type: InstanceDto })
  @Abilities(141)
  @Name('nacos/instance')
  @Operate('update')
  private async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() value: InstanceDto,
    @Res() res: Response,
  ) {
    res.locals.result = await this.instanceSrv.update(id, {
      ...value,
      create: res.locals.create as CreateEntity,
      update: res.locals.update as UpdateEntity,
    } as InstanceEntity);
  }
}
