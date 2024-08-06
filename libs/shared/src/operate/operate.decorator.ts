// 外部依赖
import { SetMetadata } from '@nestjs/common';

/**操作对象名称装饰器 */
export const Name = (name: string) => SetMetadata('name', name);

/**操作类型装饰器 */
export const Operate = (operate: string) => SetMetadata('operate', operate);
