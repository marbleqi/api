// 外部依赖
import { Module } from '@nestjs/common';
// 内部依赖
import { SharedModule } from '@libs/shared';
import { AuthModule } from '../auth';
import { PassportService, PassportController } from '.';

/**身份认证模块 */
@Module({
  imports: [SharedModule, AuthModule],
  providers: [PassportService],
  controllers: [PassportController],
})
export class PassportModule {}
