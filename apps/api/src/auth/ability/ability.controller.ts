// 外部依赖
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  ParseArrayPipe,
  Res,
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
import { Operate, Name, UpdateEntity, CommonController } from '@libs/shared';
import { Ability, Abilities, AbilityService, RoleService } from '..';

/**权限点控制器 */
@Controller('auth/ability')
@ApiTags('访问控制-权限点')
export class AbilityController extends CommonController {
  /**
   * 构造函数
   * @param abilitySrv 权限点服务
   * @param menuSrv 菜单服务
   * @param roleSrv 角色服务
   */
  constructor(
    private readonly abilitySrv: AbilityService,
    private readonly roleSrv: RoleService,
  ) {
    super();
    this.abilitySrv.add(
      ...[
        { id: 111, name: '权限点列表', description: '查看权限点列表' },
        { id: 112, name: '权限点详情', description: '查看权限点详情' },
      ].map(
        (item) =>
          ({
            pid: 110,
            moduleName: '访问控制',
            objectName: '权限点',
            type: '接口',
            ...item,
          }) as Ability,
      ),
    );
  }

  /**
   * 获取权限点清单
   * @param res 响应上下文
   */
  @Get('index')
  @ApiOperation({ summary: '获取权限点清单' })
  @ApiOkResponse({ description: '获取实例清单成功', type: [Ability] })
  @Abilities(111)
  private index(@Res() res: Response) {
    res.locals.result = this.abilitySrv.index();
  }

  /**
   * 获取权限点详情
   * @param id 权限点ID
   * @param res 响应上下文
   */
  @Get('show/:id')
  @ApiOperation({ summary: '获取权限点详情' })
  @ApiParam({ name: 'id', description: '权限点ID', example: 100 })
  @ApiOkResponse({ description: '获取权限点详情成功', type: Ability })
  @Abilities(112)
  private show(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    res.locals.result = this.abilitySrv.show(id);
  }

  /**
   * 批量调整拥有某权限点的角色
   * @param ids 角色ID数组
   * @param id 权限点ID
   * @param res 响应上下文
   */
  @Post('role/:id')
  @ApiOperation({ summary: '批量调整拥有某权限点的角色' })
  @ApiParam({ name: 'id', description: '权限点ID', example: 100 })
  @ApiBody({
    schema: {
      type: 'array',
      items: { type: 'number' },
      example: [1, 2, 3],
      description: '授权的角色ID数组',
    },
  })
  @ApiOkResponse({
    description: '批量调整角色权限点成功',
    schema: { type: 'number', example: 5, description: '更新角色记录数' },
  })
  @Abilities(145)
  @Name('auth/role')
  @Operate('ability')
  private async role(
    @Body(ParseArrayPipe) ids: number[],
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    res.locals.result = await this.roleSrv.grant(
      ids,
      id,
      res.locals.update as UpdateEntity,
    );
  }
}
