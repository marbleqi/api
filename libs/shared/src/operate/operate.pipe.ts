// 外部依赖
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

/**操作序号管道 */
@Injectable()
export class OperatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): number {
    return Number(value) || 0;
  }
}
