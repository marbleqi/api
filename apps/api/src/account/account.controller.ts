// 外部依赖
import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
// 内部依赖
import {
  SettingEntity,
  SettingService,
  OperatePipe,
  CommonController,
} from '@libs/shared';
import { UserEntity, RoleService, UserService, TokenService } from '../auth';

@Controller('account')
@ApiTags('个人用户')
export class AccountController extends CommonController {
  /**
   * 构造函数
   * @param tokenSrv 注入的令牌服务
   * @param initService 注入的初始化服务
   */
  constructor(
    private readonly settingSrv: SettingService,
    private readonly tokenSrv: TokenService,
    private readonly roleSrv: RoleService,
    private readonly userSrv: UserService,
  ) {
    super();
  }

  /**
   * 前端启动初始化时调用的应用初始化接口
   * @param tokenStr 令牌
   * @param res 响应上下文
   */
  @Get('startup')
  @ApiOperation({ summary: '应用初始化' })
  @ApiOkResponse({
    description: '应用初始化成功',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          description: '用户信息',
          properties: { id: { type: 'number' }, name: { type: 'string' } },
        },
        app: { type: 'object', description: '应用信息', properties: {} },
        ability: {
          type: 'array',
          items: { type: 'number' },
          example: [1, 2, 3],
          description: '授权权限点',
        },
      },
    },
  })
  async startup(
    @Headers('token') tokenStr: string,
    @Res() res: Response,
  ): Promise<void> {
    /**系统信息 */
    const system: SettingEntity = this.settingSrv.get('system');
    const app = system.value;
    console.debug('app', app);
    /**令牌验证结果 */
    const token = await this.tokenSrv.show(tokenStr);
    console.debug('token', token);
    const id = Number(token['id']);
    if (!id) {
      throw new UnauthorizedException(`该用户不存在！`);
    }
    // 获取用户信息
    const user = this.userSrv.get(id);
    const ability = this.userSrv.ability(id);
    console.debug('user', user);
    res.locals.result = { user, app, ability };
  }

  /**
   * 刷新令牌
   * @param tokenStr 令牌
   * @param res 响应上下文
   */
  @Get('refresh')
  @ApiOperation({ summary: '刷新令牌' })
  async refresh(
    @Headers('token') tokenStr: string,
    @Res() res: Response,
  ): Promise<void> {
    console.debug('待刷新令牌', tokenStr);
    res.locals.result = await this.tokenSrv.refresh(tokenStr);
  }

  /**
   * 获取用户
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('role')
  @ApiOperation({ summary: '获取用户' })
  async role(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): Promise<void> {
    const roles = await this.roleSrv.index(operateId);
    res.locals.result = roles.map((role) => ({
      id: role.id,
      name: role.name,
      operateId: role.update.operateId,
    }));
  }

  /**
   * 获取用户
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('user')
  @ApiOperation({ summary: '获取用户' })
  async user(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): Promise<void> {
    const users = await this.userSrv.index(operateId);
    res.locals.result = users.map((user) => ({
      id: user.id,
      name: user.name,
      operateId: user.update.operateId,
    }));
  }
}
