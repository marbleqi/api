// 外部依赖
import { OnApplicationBootstrap, NotFoundException } from '@nestjs/common';
import { Repository, ObjectLiteral, FindOptionsWhere, MoreThan } from 'typeorm';
import { Subject } from 'rxjs';
// 内部依赖
import { CreateEntity, UpdateEntity } from '..';

/**通用对象服务基类 */
export class CommonService<
  Entity extends ObjectLiteral,
  EntityLog extends ObjectLiteral,
> implements OnApplicationBootstrap
{
  /**对象名称 */
  private readonly commonName: string;
  /**通用对象缓存Map */
  protected cache: Map<number, Entity>;
  /**最大操作序号 */
  protected operateId: number;
  /**操作更新订阅 */
  protected updateSub: Subject<number>;

  /**
   * 构造函数
   * @param commonName 对象名称
   * @param commonRepository 对象存储器
   * @param commonLogRepository 对象日志存储器
   */
  protected constructor(
    commonName: string,
    protected readonly commonRepository: Repository<Entity>,
    protected readonly commonLogRepository: Repository<EntityLog>,
  ) {
    this.commonName = commonName;
    this.cache = new Map<number, Entity>();
    this.operateId = 0;
    this.updateSub = new Subject<number>();
    this.updateSub.subscribe(async (operateId) => {
      /**待追加的日志记录 */
      const commons: EntityLog[] = (await this.commonRepository.findBy({
        update: { operateId },
      } as unknown as FindOptionsWhere<Entity>)) as unknown as EntityLog[];
      // 追加日志
      await this.commonLogRepository.save(commons);
      // 刷新缓存数据
      await this.sync();
    });
  }

  /**
   * 生成指定长度的随机字符串
   * @param length 随机字符串长度
   * @param type 随机字符串类型，默认字符串型
   * @returns 指定长度的随机字符串
   */
  random(length: number, type: 'string' | 'number' = 'string'): string {
    /**随机字符串游标 */
    let i = 0;
    /**可选字符集 */
    const chars =
      type === 'string'
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
        : '1234567890';
    /**字符集长度 */
    const maxPos = chars.length;
    /**随机字符串 */
    let result: string = '';
    while (i < length) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
      i++;
    }
    return result;
  }

  /**
   * 获取需同步数据
   * @returns 增量数据
   */
  protected async commons(): Promise<Entity[]> {
    return await this.commonRepository.findBy({
      update: {
        operateId: MoreThan(this.operateId),
      },
    } as unknown as FindOptionsWhere<Entity>);
  }

  /**缓存同步 */
  async sync(): Promise<void> {
    /**待同步的对象数据 */
    const commons = await this.commons();
    for (const common of commons) {
      this.cache.set(common.id, common);
      if (this.operateId < common.update.operateId) {
        this.operateId = common.update.operateId;
      }
    }
  }

  /**启动后初始化 */
  async onApplicationBootstrap(): Promise<void> {
    await this.sync();
  }

  /**
   * 获取缓存中的对象清单
   * @param operateId 操作序号，用于获取增量数据
   * @returns 对象清单
   */
  list(operateId: number = 0): Entity[] {
    return Array.from(this.cache.values()).filter(
      (common) => common.update.operateId > operateId,
    );
  }

  /**
   * 获取对象清单
   * @param operateId 操作序号，用于获取增量数据
   * @returns 对象清单
   */
  async index(operateId: number = 0): Promise<Entity[]> {
    await this.sync();
    return this.list(operateId);
  }

  /**
   * 获取对象数量
   * @returns 对象数量
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * 获取缓存中的对象详情
   * @param id 对象ID
   * @returns 对象详情
   */
  get(id: number): Entity {
    const common = this.cache.get(id);
    if (common) {
      return common;
    }
    throw new NotFoundException(`${this.commonName}不存在`);
  }

  /**
   * 获取对象详情
   * @param id 对象ID
   * @returns 对象详情
   */
  async show(id: number): Promise<Entity> {
    await this.sync();
    return this.get(id);
  }

  /**
   * 获取对象变更日志
   * @param id 对象ID
   * @returns 对象变更记录
   */
  async log(id: number): Promise<EntityLog[]> {
    return await this.commonLogRepository.findBy({
      id,
    } as unknown as FindOptionsWhere<EntityLog>);
  }

  /**缓存重置 */
  async reset(): Promise<void> {
    // 清空缓存
    this.cache.clear();
    // 重置操作序号
    this.operateId = 0;
    // 缓存同步
    await this.sync();
  }

  /**
   * 创建对象
   * @param common 对象信息
   * @returns 新对象主键ID，如果创建失败则返回0
   */
  async create(common: Entity): Promise<number> {
    // 如果主键ID已存在，则删除
    if (common?.id) {
      delete common.id;
    }
    // 如果创建字段不存在，则追加创建信息
    if (!common?.create) {
      const update = common.update as UpdateEntity;
      common = {
        ...common,
        create: {
          userId: update.userId,
          at: update.at,
        } as CreateEntity,
      };
    }
    /**操作结果 */
    const result = await this.commonRepository.insert(common);
    if (result.identifiers.length) {
      this.updateSub.next(Number(common.update.operateId));
    }
    return common?.id ? Number(common.id) : 0;
  }

  /**
   * 更新对象
   * @param id 对象主键ID
   * @param common 对象信息
   * @returns 更新记录数
   */
  async update(id: number, common: Entity): Promise<number> {
    // 如果存在创建信息，则删除创建信息以避免覆盖创建信息
    if (common?.create) {
      delete common.create;
    }
    /**操作结果 */
    const result = await this.commonRepository.update(id, common);
    if (result.affected) {
      this.updateSub.next(Number(common.update.operateId));
    }
    return result.affected;
  }

  /**
   * 批量更新对象状态
   * @param ids 需要更新的对象ID集合
   * @param status 待设置的对象状态
   * @param update 更新信息
   * @returns 更新记录数
   */
  async status(
    ids: number[],
    status: boolean,
    update: UpdateEntity,
  ): Promise<number> {
    // 获取需要更新的对象ID集合
    ids = this.list()
      .filter((common) => ids.includes(common.id) && common.status !== status)
      .map((common) => common.id);
    /**操作结果 */
    const result = await this.commonRepository.update(ids, {
      status,
      update,
    } as unknown as Entity);
    if (result.affected) {
      this.updateSub.next(Number(update.operateId));
    }
    return result.affected;
  }

  /**
   * 保存对象
   * @param common 对象信息
   * @returns 更新记录数
   */
  async save(common: Entity): Promise<number> {
    // 如果存在创建信息，则删除创建信息以避免覆盖创建信息
    if (common?.create) {
      delete common.create;
    }
    /**操作结果 */
    const result = await this.commonRepository.save(common);
    if (result.length) {
      this.updateSub.next(Number(common.update.operateId));
    }
    return result.length;
  }
}
