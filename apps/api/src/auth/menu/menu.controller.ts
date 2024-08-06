// 外部依赖
import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  ParseIntPipe,
  ParseBoolPipe,
  ParseArrayPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiBody,
  ApiCreatedResponse,
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
  MenuDto,
  MenuEntity,
  MenuLogEntity,
  AbilityService,
  MenuService,
} from '..';

/**菜单控制器 */
@Controller('auth/menu')
@ApiTags('访问控制-菜单')
export class MenuController extends CommonController {
  /**
   * 构造函数
   * @param sortSrv 排序服务
   * @param abilitySrv 权限点服务
   * @param menuSrv 菜单服务
   */
  constructor(
    private readonly sortSrv: SortService,
    private readonly abilitySrv: AbilityService,
    private readonly menuSrv: MenuService,
  ) {
    super();
    this.abilitySrv.add(
      ...[
        { id: 121, name: '菜单列表', description: '查看菜单列表' },
        { id: 122, name: '菜单详情', description: '查看菜单详情' },
        { id: 123, name: '菜单历史', description: '菜单更新历史' },
        { id: 124, name: '创建菜单', description: '创建新的菜单' },
        { id: 125, name: '修改菜单', description: '修改已有的菜单' },
      ].map(
        (item) =>
          ({
            pid: 120,
            moduleName: '访问控制',
            objectName: '菜单',
            type: '接口',
            ...item,
          }) as Ability,
      ),
    );
  }

  /**
   * 获取菜单清单
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('index')
  @ApiOperation({ summary: '获取菜单清单' })
  @ApiQuery({ name: 'operateId', description: '操作序号', example: 0 })
  @ApiOkResponse({ description: '获取菜单清单成功', type: [MenuEntity] })
  @Abilities(121)
  private async index(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.menuSrv.index(operateId);
  }

  /**
   * 获取菜单清单
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('list')
  @ApiOperation({ summary: '获取菜单清单' })
  @ApiQuery({ name: 'operateId', description: '操作序号', example: 0 })
  @ApiOkResponse({ description: '获取菜单清单成功', type: [MenuEntity] })
  @Abilities(121)
  private list(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): void {
    res.locals.result = this.menuSrv.list(operateId);
  }

  /**
   * 获取菜单排序
   * @param res 响应上下文
   */
  @Get('sort')
  @ApiOperation({ summary: '获取菜单排序' })
  @Abilities(121)
  private sorted(@Res() res: Response): void {
    res.locals.result = this.sortSrv.get('auth/menu');
  }

  /**
   * 获取菜单详情
   * @param menu 现菜单信息
   * @param res 响应上下文
   */
  @Get('show/:id')
  @ApiOperation({ summary: '获取菜单详情' })
  @ApiParam({ name: 'id', description: '菜单ID', example: 1 })
  @ApiOkResponse({ description: '获取菜单详情成功', type: MenuEntity })
  @Abilities(122)
  private async show(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.menuSrv.show(id);
  }

  /**
   * 获取菜单详情
   * @param menu 现菜单信息
   * @param res 响应上下文
   */
  @Get('get/:id')
  @ApiOperation({ summary: '获取菜单详情' })
  @ApiParam({ name: 'id', description: '菜单ID', example: 1 })
  @ApiOkResponse({ description: '获取菜单详情成功', type: MenuEntity })
  @Abilities(122)
  private get(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): void {
    res.locals.result = this.menuSrv.get(id);
  }

  /**
   * 获取菜单变更日志
   * @param menu 现菜单信息
   * @param res 响应上下文
   */
  @Get('log/:id')
  @ApiOperation({ summary: '获取菜单变更日志' })
  @ApiParam({ name: 'id', description: '菜单ID', example: 1 })
  @ApiOkResponse({ description: '获取菜单变更日志成功', type: [MenuLogEntity] })
  @Abilities(123)
  private async log(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.menuSrv.log(id);
  }

  /**
   * 创建菜单
   * @param value 新菜单信息
   * @param res 响应上下文
   */
  @Post('create')
  @ApiOperation({ summary: '创建菜单' })
  @ApiBody({ description: '新菜单信息', type: MenuDto })
  @ApiCreatedResponse({ description: '创建菜单成功', type: MenuEntity })
  @Abilities(124)
  @Name('auth/menu')
  @Operate('create')
  private async create(@Body() value: MenuDto, @Res() res: Response) {
    res.locals.result = await this.menuSrv.create({
      ...value,
      create: res.locals.create as CreateEntity,
      update: res.locals.update as UpdateEntity,
    } as MenuEntity);
  }

  /**
   * 更新菜单（含禁用和启用菜单）
   * @param menu 现菜单信息
   * @param value 新菜单信息
   * @param res 响应上下文
   */
  @Post('update/:id')
  @ApiOperation({ summary: '更新菜单' })
  @ApiOkResponse({
    description: '更新菜单成功',
    schema: { type: 'number', example: 1, description: '更新菜单记录数' },
  })
  @Abilities(125)
  @Name('auth/menu')
  @Operate('update')
  private async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() value: MenuDto,
    @Res() res: Response,
  ) {
    res.locals.result = await this.menuSrv.update(id, {
      ...value,
      update: res.locals.update as UpdateEntity,
    } as MenuEntity);
  }

  /**
   * 菜单排序
   * @param value 菜单排序信息
   * @param res 响应上下文
   */
  @Post('sort')
  @ApiOperation({ summary: '菜单排序' })
  @ApiBody({
    schema: {
      type: 'array',
      items: { type: 'number' },
      example: [1, 2, 3],
      description: '排序后的菜单ID数组',
    },
  })
  @ApiOkResponse({
    description: '菜单排序成功',
    schema: { type: 'number', example: 5, description: '菜单排序记录数' },
  })
  @Abilities(125)
  @Name('auth/menu')
  @Operate('sort')
  private async sort(@Body() value: number[], @Res() res: Response) {
    res.locals.result = await this.sortSrv.update({
      name: 'auth/menu',
      status: true,
      value,
      update: res.locals.update as UpdateEntity,
    } as SortEntity);
  }

  /**
   * 批量设置菜单状态
   * @param status 新的菜单状态
   * @param ids 需要设置的菜单ID集合
   * @param res 响应上下文
   */
  @Post('status')
  @ApiOperation({ summary: '批量设置菜单状态' })
  @ApiOkResponse({
    description: '批量设置菜单状态成功',
    schema: { type: 'number', example: 5, description: '设置菜单记录数' },
  })
  @Abilities(125)
  @Name('auth/menu')
  @Operate('status')
  private async status(
    @Body('ids', ParseArrayPipe) ids: number[],
    @Body('status', ParseBoolPipe) status: boolean,
    @Res() res: Response,
  ) {
    res.locals.result = await this.menuSrv.status(
      ids,
      status,
      res.locals.update as UpdateEntity,
    );
  }

  /**
   * 批量设置菜单路由复用
   * @param reuse 新的路由复用值
   * @param ids 需要设置的菜单ID集合
   * @param res 响应上下文
   */
  @Post('reuse')
  @ApiOperation({ summary: '批量设置菜单路由复用' })
  @Abilities(125)
  @Name('auth/menu')
  @Operate('reuse')
  private async reuse(
    @Body('ids', ParseArrayPipe) ids: number[],
    @Body('reuse', ParseBoolPipe) reuse: boolean,
    @Res() res: Response,
  ) {
    res.locals.result = await this.menuSrv.reuse(
      ids,
      reuse,
      res.locals.update as UpdateEntity,
    );
  }
}
