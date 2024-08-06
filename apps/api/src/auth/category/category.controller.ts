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
  CategoryDto,
  CategoryEntity,
  AbilityService,
  CategoryService,
} from '..';

/**菜单类别控制器 */
@Controller('auth/category')
@ApiTags('访问控制-菜单类别')
export class CategoryController extends CommonController {
  /**
   * 构造函数
   * @param sortSrv 排序服务
   * @param abilitySrv 权限点服务
   * @param categorySrv 菜单类别服务
   */
  constructor(
    private readonly sortSrv: SortService,
    private readonly abilitySrv: AbilityService,
    private readonly categorySrv: CategoryService,
  ) {
    super();
    this.abilitySrv.add(
      ...[
        { id: 131, name: '菜单类别列表', description: '查看菜单类别列表' },
        { id: 132, name: '菜单类别详情', description: '查看菜单类别详情' },
        { id: 133, name: '菜单类别历史', description: '菜单类别更新历史' },
        { id: 134, name: '创建菜单类别', description: '创建新的菜单类别' },
        { id: 135, name: '修改菜单类别', description: '修改已有的菜单类别' },
      ].map(
        (item) =>
          ({
            pid: 130,
            moduleName: '访问控制',
            objectName: '菜单类别',
            type: '接口',
            ...item,
          }) as Ability,
      ),
    );
  }

  /**
   * 获取菜单类别清单
   * @param operateId 操作序号，用于获取增量数据
   * @param res 响应上下文
   */
  @Get('list')
  @Abilities(131)
  private list(
    @Query('operateId', OperatePipe) operateId: number,
    @Res() res: Response,
  ): void {
    res.locals.result = this.categorySrv.list(operateId);
  }

  /**
   * 获取菜单类别排序
   * @param res 响应上下文
   */
  @Get('sort')
  @Abilities(131)
  private sorted(@Res() res: Response): void {
    res.locals.result = this.sortSrv.get('auth/category');
  }

  /**
   * 获取菜单类别详情
   * @param category 现菜单类别信息
   * @param res 响应上下文
   */
  @Get('get/:id')
  @Abilities(132)
  private get(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): void {
    res.locals.result = this.categorySrv.get(id);
  }

  /**
   * 获取菜单类别变更日志
   * @param category 现菜单类别信息
   * @param res 响应上下文
   */
  @Get('log/:id')
  @Abilities(133)
  private async log(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    res.locals.result = await this.categorySrv.log(id);
  }

  /**
   * 创建菜单类别
   * @param value 新菜单类别信息
   * @param res 响应上下文
   */
  @Post('create')
  @Abilities(134)
  @Name('auth/category')
  @Operate('create')
  private async create(@Body() value: CategoryDto, @Res() res: Response) {
    res.locals.result = await this.categorySrv.create({
      ...value,
      create: res.locals.create as CreateEntity,
      update: res.locals.update as UpdateEntity,
    } as CategoryEntity);
  }

  /**
   * 更新菜单类别（含禁用）
   * @param category 现菜单类别信息
   * @param value 新菜单类别信息
   * @param res 响应上下文
   */
  @Post('update/:id')
  @Abilities(135)
  @Name('auth/category')
  @Operate('update')
  private async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() value: CategoryDto,
    @Res() res: Response,
  ) {
    res.locals.result = await this.categorySrv.update(id, {
      ...value,
      update: res.locals.update as UpdateEntity,
    } as CategoryEntity);
  }

  /**
   * 菜单类别排序
   * @param value 菜单类别排序信息
   * @param res 响应上下文
   */
  @Post('sort')
  @Abilities(135)
  @Name('auth/category')
  @Operate('sort')
  private async sort(@Body() value: any[], @Res() res: Response) {
    res.locals.result = await this.sortSrv.update({
      name: 'auth/category',
      status: true,
      value,
      update: res.locals.update as UpdateEntity,
    } as SortEntity);
  }
}
