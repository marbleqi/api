// 外部依赖
import {
  ForbiddenException,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  ParseBoolPipe,
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
  OperatePipe,
  CommonController,
} from '@libs/shared';
import {
  Ability,
  Abilities,
  UserDto,
  UserEntity,
  AbilityService,
  UserService,
} from '..';

/**用户控制器 */
@Controller('auth/user')
@ApiTags('访问控制-用户')
export class UserController extends CommonController {
  /**
   * 构造函数
   * @param abilitySrv 权限点服务
   * @param userSrv 用户服务
   */
  constructor(
    private readonly abilitySrv: AbilityService,
    private readonly userSrv: UserService,
  ) {
    super();
    this.abilitySrv.add(
      ...[
        { id: 151, name: '用户列表', description: '查看用户列表' },
        { id: 152, name: '用户详情', description: '查看用户详情' },
        { id: 153, name: '用户历史', description: '用户更新历史' },
        { id: 154, name: '创建用户', description: '创建新的用户' },
        { id: 155, name: '更新用户', description: '更新用户信息' },
        { id: 156, name: '用户解锁', description: '对用户进行解锁' },
        { id: 157, name: '重置密码', description: '重置用户密码' },
      ].map(
        (item) =>
          ({
            pid: 150,
            moduleName: '访问控制',
            objectName: '用户',
            type: '接口',
            ...item,
          }) as Ability,
      ),
    );
  }

  /**
   * 获取用户清单
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('index')
  @Abilities(151)
  private async index(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.userSrv.index(operateId);
  }

  /**
   * 获取用户清单
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('list')
  @Abilities(151)
  private list(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): void {
    res.locals.result = this.userSrv.list(operateId);
  }

  /**
   * 获取用户详情
   * @param user 现用户信息
   * @param res 响应上下文
   */
  @Get('show/:id')
  @Abilities(152)
  private async show(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.userSrv.show(id);
  }

  /**
   * 获取用户详情
   * @param user 现用户信息
   * @param res 响应上下文
   */
  @Get('get/:id')
  @Abilities(152)
  private get(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): void {
    res.locals.result = this.userSrv.get(id);
  }

  /**
   * 获取用户变更日志
   * @param user 现用户信息
   * @param res 响应上下文
   */
  @Get('log/:id')
  @Abilities(153)
  private async log(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.userSrv.log(id);
  }

  /**
   * 创建用户
   * @param value 新用户信息
   * @param res 响应上下文
   */
  @Post('create')
  @Abilities(154)
  @Name('auth/user')
  @Operate('create')
  private async create(
    @Body() value: UserDto,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.userSrv.create({
      ...value,
      create: res.locals.create as CreateEntity,
      update: res.locals.update as UpdateEntity,
    } as UserEntity);
  }

  /**
   * 更新用户（含禁用）
   * @param user 现用户信息
   * @param value 新用户信息
   * @param res 响应上下文
   */
  @Post('update/:id')
  @Abilities(155)
  @Name('auth/user')
  @Operate('update')
  private async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() value: UserDto,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.userSrv.update(id, {
      ...value,
      update: res.locals.update as UpdateEntity,
    } as UserEntity);
  }

  /**
   * 解锁用户
   * @param user 现用户信息
   * @param res 响应上下文
   */
  @Post('status')
  @Abilities(156)
  @Name('auth/user')
  @Operate('status')
  private async status(
    @Body('ids', ParseArrayPipe) ids: number[],
    @Body('status', ParseBoolPipe) status: boolean,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.userSrv.status(
      ids,
      status,
      res.locals.update as UpdateEntity,
    );
  }

  /**
   * 解锁用户
   * @param user 现用户信息
   * @param res 响应上下文
   */
  @Post('unlock')
  @Abilities(156)
  @Name('auth/user')
  @Operate('unlock')
  private async unlock(
    @Body('ids', ParseArrayPipe) ids: number[],
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.userSrv.unlock(
      ids,
      res.locals.update as UpdateEntity,
    );
  }

  /**
   * 重置用户密码
   * @param user 现用户信息
   * @param newPassword 新密码
   * @param res 响应上下文
   */
  @Post('resetpsw')
  @Abilities(157)
  @Name('auth/user')
  @Operate('resetpsw')
  private async resetpsw(
    @Body('id', ParseIntPipe) id: number,
    @Body('newPassword') newPassword: string,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.userSrv.resetpsw(
      id,
      newPassword,
      res.locals.update as UpdateEntity,
    );
    // 将上下文的密码替换，避免将密码明文记入日志
    res.locals.request.body.newPassword = '************';
  }
}
