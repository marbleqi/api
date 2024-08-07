// 外部依赖
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseBoolPipe,
  ParseIntPipe,
  ParseArrayPipe,
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
  RoleDto,
  RoleEntity,
  AbilityService,
  RoleService,
  UserService,
} from '..';

/**角色控制器 */
@Controller('auth/role')
@ApiTags('访问控制-角色')
export class RoleController extends CommonController {
  /**
   * 构造函数
   * @param sortSrv 排序服务
   * @param abilitySrv 权限点服务
   * @param roleSrv 角色服务
   * @param userSrv 用户服务
   */
  constructor(
    private readonly sortSrv: SortService,
    private readonly abilitySrv: AbilityService,
    private readonly roleSrv: RoleService,
    private readonly userSrv: UserService,
  ) {
    super();
    this.abilitySrv.add(
      ...[
        { id: 141, name: '角色列表', description: '查看角色列表' },
        { id: 142, name: '角色详情', description: '查看角色详情' },
        { id: 143, name: '角色历史', description: '角色更新历史' },
        { id: 144, name: '创建角色', description: '创建新的角色' },
        { id: 145, name: '修改角色', description: '修改已有的角色' },
      ].map(
        (item) =>
          ({
            pid: 140,
            moduleName: '访问控制',
            objectName: '角色',
            type: '接口',
            ...item,
          }) as Ability,
      ),
    );
  }

  /**
   * 获取角色清单
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('index')
  @ApiOperation({ summary: '获取角色清单' })
  @Abilities(141)
  private async index(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.roleSrv.index(operateId);
  }

  /**
   * 获取角色清单
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('list')
  @ApiOperation({ summary: '获取角色清单' })
  @Abilities(141)
  private list(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): void {
    res.locals.result = this.roleSrv.list(operateId);
  }

  /**
   * 获取角色排序
   * @param res 响应上下文
   */
  @Get('sort')
  @Abilities(141)
  private sorted(@Res() res: Response): void {
    res.locals.result = this.sortSrv.get('auth/role');
  }

  /**
   * 获取角色详情
   * @param role 现角色信息
   * @param res 响应上下文
   */
  @Get('show/:id')
  @Abilities(142)
  private async show(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.roleSrv.show(id);
  }

  /**
   * 获取角色详情
   * @param role 现角色信息
   * @param res 响应上下文
   */
  @Get('get/:id')
  @Abilities(142)
  private get(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): void {
    res.locals.result = this.roleSrv.get(id);
  }

  /**
   * 获取角色变更日志
   * @param role 现角色信息
   * @param res 响应上下文
   */
  @Get('log/:id')
  @Abilities(143)
  private async log(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.roleSrv.log(id);
  }

  /**
   * 创建角色
   * @param role 现角色信息
   * @param res 响应上下文
   */
  @Post('create')
  @Abilities(144)
  @Name('auth/role')
  @Operate('create')
  private async create(
    @Body() value: RoleDto,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.roleSrv.create({
      ...value,
      create: res.locals.create as CreateEntity,
      update: res.locals.update as UpdateEntity,
    } as RoleEntity);
  }

  /**
   * 更新角色（含禁用和启用角色）
   * @param role 现角色信息
   * @param value 新角色信息
   * @param res 响应上下文
   */
  @Post('update/:id')
  @Abilities(145)
  @Name('auth/role')
  @Operate('update')
  private async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() value: RoleDto,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.roleSrv.update(id, {
      ...value,
      update: res.locals.update as UpdateEntity,
    } as RoleEntity);
  }

  /**
   * 修改角色排序
   * @param value 角色排序信息
   * @param res 响应上下文
   */
  @Post('sort')
  @Abilities(145)
  @Name('auth/role')
  @Operate('sort')
  private async sort(
    @Body() value: number[],
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.sortSrv.update({
      name: 'auth/role',
      status: true,
      value,
      update: res.locals.update as UpdateEntity,
    } as SortEntity);
  }

  /**
   * 批量设置角色状态
   * @param status 新的角色状态
   * @param ids 需要设置的菜单ID集合
   * @param res 响应上下文
   */
  @Post('status')
  @Abilities(145)
  @Name('auth/role')
  @Operate('status')
  private async status(
    @Body('ids', ParseArrayPipe) ids: number[],
    @Body('status', ParseBoolPipe) status: boolean,
    @Res() res: Response,
  ) {
    res.locals.result = await this.roleSrv.status(
      ids,
      status,
      res.locals.update as UpdateEntity,
    );
  }

  /**
   * 批量调整拥有某角色的用户
   * @param id 角色ID
   * @param ids 需要授权的用户ID数组
   * @param res 响应上下文
   */
  @Post('users/:id')
  @Abilities(155)
  @Name('auth/user')
  @Operate('roles')
  private async grant(
    @Param('id', ParseIntPipe) id: number,
    @Body(ParseArrayPipe) ids: number[],
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.userSrv.grant(
      id,
      ids,
      res.locals.update as UpdateEntity,
    );
  }
}
