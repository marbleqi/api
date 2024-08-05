import { Module } from '@nestjs/common';
import { KongService } from '.';

@Module({
  providers: [KongService],
  exports: [KongService],
})
export class KongModule {}
