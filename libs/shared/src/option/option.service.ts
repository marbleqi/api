// 外部依赖
import { Repository, ObjectLiteral, FindOptionsWhere, MoreThan } from 'typeorm';
import { Subject } from 'rxjs';
// 内部依赖
import { CreateEntity, UpdateEntity } from '..';

/**配置基础服务 */
export class OptionService<
  Entity extends ObjectLiteral,
  EntityLog extends ObjectLiteral,
> {
  /**主键字段名 */
  private readonly keyName: string;
  /**配置对象缓存 */
  protected cache: Map<string, Entity>;
  /**当前操作序号 */
  protected operateId: number;
  /**操作更新订阅 */
  protected updateSub: Subject<number>;

  /**
   * 构造函数
   * @param keyName 主键名
   * @param optionRepository 对象存储器
   * @param optionLogRepository 对象日志存储器
   */
  protected constructor(
    keyName: string,
    protected readonly optionRepository: Repository<Entity>,
    protected readonly optionLogRepository: Repository<EntityLog>,
  ) {
    this.keyName = keyName;
    this.cache = new Map<string, Entity>();
    this.operateId = -1;
    this.updateSub = new Subject<number>();
    this.updateSub.subscribe(async (operateId) => {
      /**待追加的日志记录 */
      const options: EntityLog[] = (await this.optionRepository.findBy({
        update: { operateId },
      } as unknown as FindOptionsWhere<Entity>)) as unknown as EntityLog[];
      // 追加日志
      await this.optionLogRepository.save(options);
      // 刷新缓存数据
      await this.sync();
    });
  }

  /**
   * 获取需同步数据
   * @returns 增量数据
   */
  protected async options(): Promise<Entity[]> {
    return await this.optionRepository.findBy({
      update: {
        operateId: MoreThan(this.operateId),
      },
    } as unknown as FindOptionsWhere<Entity>);
  }

  /**缓存同步 */
  async sync(): Promise<void> {
    /**需同步的配置数据 */
    const options = await this.options();
    for (const option of options) {
      this.cache.set(option[this.keyName], option);
      if (this.operateId < option.update.operateId) {
        this.operateId = option.update.operateId;
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
      (option) => option.update.operateId > operateId,
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
   * 获取缓存中的对象详情
   * @param name 主键
   * @returns 对象详情
   */
  get(name: string): Entity {
    return this.cache.get(name);
  }

  /**
   * 获取对象详情
   * @param name 主键
   * @returns 对象详情
   */
  async show(name: string): Promise<Entity> {
    await this.sync();
    return this.get(name);
  }

  /**
   * 获取对象变更日志
   * @param name 主键
   * @returns 对象变更记录
   */
  async log(name: string): Promise<EntityLog[]> {
    return await this.optionLogRepository.findBy({
      name,
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
   * 更新对象
   * @param option 对象信息
   * @returns 更新记录数
   */
  async update(option: Entity): Promise<number> {
    // 如果键值已存在
    if (this.cache.has(option.name)) {
      // 设置操作类型为更新
      option.update.operate = 'update';
      // 如果创建字段存在，则删除创建信息以避免覆盖创建信息;
      if (option.create) {
        delete option.create;
      }
    }
    // 如果键值不存在
    else {
      // 设置操作类型为创建
      option.update.operate = 'create';
      // 如果创建字段不存在，则追加创建信息
      if (!option?.create) {
        const update = option.update as UpdateEntity;
        option = {
          ...option,
          create: {
            userId: update.userId,
            at: update.at,
          } as CreateEntity,
        };
      }
    }
    /**保存结果 */
    const result = await this.optionRepository.save(option);
    if (result) {
      this.updateSub.next(Number(option.update.operateId));
      return 1;
    }
    return 0;
  }
}
