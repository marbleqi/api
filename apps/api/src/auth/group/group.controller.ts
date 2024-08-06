// 外部依赖
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiHeader,
  ApiOperation,
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
import {
  Ability,
  Abilities,
  GroupDto,
  GroupEntity,
  AbilityService,
  GroupService,
} from '..';

/**用户组控制器 */
@Controller('auth/group')
@ApiTags('访问控制-用户组')
export class GroupController extends CommonController {
  /**
   * 构造函数
   * @param sortSrv 排序服务
   * @param abilitySrv 权限点服务
   * @param groupSrv 用户组服务
   */
  constructor(
    private readonly sortSrv: SortService,
    private readonly abilitySrv: AbilityService,
    private readonly groupSrv: GroupService,
  ) {
    super();
    this.abilitySrv.add(
      ...[
        { id: 161, name: '用户组列表', description: '查看用户组列表' },
        { id: 162, name: '用户组详情', description: '查看用户组详情' },
        { id: 163, name: '用户组历史', description: '用户组更新历史' },
        { id: 164, name: '创建用户组', description: '创建新的用户组' },
        { id: 165, name: '修改用户组', description: '修改已有的用户组' },
      ].map(
        (item) =>
          ({
            pid: 160,
            moduleName: '访问控制',
            objectName: '用户组',
            type: '接口',
            ...item,
          }) as Ability,
      ),
    );
  }

  /**
   * 获取用户组清单
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('list')
  @Abilities(161)
  private list(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): void {
    res.locals.result = this.groupSrv.list(operateId);
  }

  /**
   * 获取用户组排序
   * @param res 响应上下文
   */
  @Get('sort')
  @Abilities(161)
  private sorted(@Res() res: Response): void {
    res.locals.result = this.sortSrv.get('auth/group');
  }

  /**
   * 获取用户组详情
   * @param group 现用户组信息
   * @param res 响应上下文
   */
  @Get('get/:id')
  @Abilities(162)
  private get(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): void {
    res.locals.result = this.groupSrv.get(id);
  }

  /**
   * 获取用户组变更日志
   * @param group 现用户组信息
   * @param res 响应上下文
   */
  @Get('log/:id')
  @Abilities(163)
  private async log(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.groupSrv.log(id);
  }

  /**
   * 创建菜单类别
   * @param value 提交消息体
   * @param res 响应上下文
   */
  @Post('create')
  @Abilities(164)
  @Name('auth/group')
  @Operate('create')
  private async create(@Body() value: GroupDto, @Res() res: Response) {
    res.locals.result = await this.groupSrv.create({
      ...value,
      create: res.locals.create as CreateEntity,
      update: res.locals.update as UpdateEntity,
    } as GroupEntity);
  }

  /**
   * 更新菜单类别（含禁用）
   * @param group 现用户组信息
   * @param value 提交消息体
   * @param res 响应上下文
   */
  @Post('update/:id')
  @Abilities(165)
  @Name('auth/group')
  @Operate('update')
  private async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() value: GroupDto,
    @Res() res: Response,
  ) {
    res.locals.result = await this.groupSrv.update(id, {
      ...value,
      create: res.locals.create as CreateEntity,
      update: res.locals.update as UpdateEntity,
    } as GroupEntity);
  }
}
