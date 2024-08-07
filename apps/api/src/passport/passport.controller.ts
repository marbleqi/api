// 外部依赖
import {
  Controller,
  Get,
  Post,
  Headers,
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
  ApiUnauthorizedResponse,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

// 内部依赖
import { SettingEntity, RedisService, SettingService } from '@libs/shared';
import { Token, UserService, TokenService } from '../auth';
import { SettingDto } from '../system';

@Controller('passport')
@ApiTags('身份认证')
export class PassportController {
  constructor(
    private readonly settingSrv: SettingService,
    private readonly userSrv: UserService,
    private readonly tokenSrv: TokenService,
  ) {}

  /**
   * 应用初始化
   * @param tokenStr 令牌
   * @param res 响应上下文
   */
  @Get('startup')
  @ApiOperation({ summary: '应用初始化' })
  @ApiOkResponse({ description: '应用初始化', type: SettingDto })
  startup(@Res() res: Response): void {
    const system: SettingEntity = this.settingSrv.get('system');
    res.locals.result = system.value;
  }

  /**
   * 密码登录
   * @param loginName 登陆名
   * @param loginPsw 密码
   * @param loginIp 客户端IP
   * @param res 响应上下文
   */
  @Post('login')
  @ApiOperation({ summary: '密码登录' })
  @ApiHeader({
    name: 'x-real-ip',
    description: '客户端IP',
    required: true,
    example: '127.0.0.1',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        loginName: { type: 'string', example: 'root', description: '登陆名' },
        loginPsw: { type: 'string', example: 'root', description: '密码' },
      },
    },
  })
  @ApiOkResponse({ description: '登录成功', type: Token })
  @ApiUnauthorizedResponse({
    description: '身份认证失败',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '用户令牌验证无效' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  async login(
    @Body() body: any,
    @Body('loginName') loginName: string,
    @Body('loginPsw') loginPsw: string,
    @Headers('x-real-ip') loginIp: string,
    @Res() res: Response,
  ): Promise<void> {
    // 将上下文的密码替换，避免将密码明文记入日志
    res.locals.request.body.loginPsw = '************';
    console.debug('loginIpA', loginIp);
    loginIp = loginIp ?? '127.0.0.1';
    console.debug('loginIpB', loginIp);
    // 验证用户身份
    const user = await this.userSrv.login(loginName, loginPsw, loginIp);
    console.debug('userB', body, user, user.id, loginIp);
    res.locals.result = await this.tokenSrv.create(user.id);
  }
}
