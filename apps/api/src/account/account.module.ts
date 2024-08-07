// 外部依赖
import { Module } from '@nestjs/common';
// 内部依赖
import { SharedModule } from '@libs/shared';
import { AuthModule } from '../auth/auth.module';
import { AccountGateway, AccountController } from '.';

@Module({
  imports: [SharedModule, AuthModule],
  providers: [AccountGateway],
  controllers: [AccountController],
})
export class AccountModule {}
