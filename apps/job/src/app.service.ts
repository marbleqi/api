import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  /**定时任务 */
  @Cron('*/5 * * * * *')
  apply() {
    console.log(Date.now(), '每5秒一次的定时任务');
  }
}
