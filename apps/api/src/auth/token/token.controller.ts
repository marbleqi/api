// 外部依赖
import { Controller, Res, Param, Get, Post, Delete } from '@nestjs/common';
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
import { Operate, Name, UpdateEntity, CommonController } from '@libs/shared';
import { Ability, Abilities, AbilityService, TokenService } from '..';

/**令牌控制器 */
@Controller('auth/token')
@ApiTags('访问控制-令牌')
export class TokenController extends CommonController {
  /**
   * 构造函数
   * @param abilitySrv 权限点服务
   * @param tokenSrv 令牌服务
   */
  constructor(
    private readonly abilitySrv: AbilityService,
    private readonly tokenSrv: TokenService,
  ) {
    super();
    this.abilitySrv.add(
      ...[
        { id: 171, name: '令牌列表', description: '查看令牌列表' },
        { id: 176, name: '作废令牌', description: '强制令牌失效' },
      ].map(
        (item) =>
          ({
            pid: 170,
            moduleName: '访问控制',
            objectName: '令牌',
            type: '接口',
            ...item,
          }) as Ability,
      ),
    );
  }

  /**
   * 获取令牌清单
   * @param res 响应上下文
   */
  @Get('index')
  @Abilities(171)
  private async index(@Res() res: Response): Promise<void> {
    res.locals.result = await this.tokenSrv.index();
  }

  /**
   * 令牌作废
   * @param token 待作废的令牌
   * @param res 响应上下文
   */
  @Delete('destroy/:token')
  @Abilities(176)
  private async destroy(
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    res.locals.result = await this.tokenSrv.destroy(token);
  }
}
