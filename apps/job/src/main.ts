// 外部依赖
import { NestFactory } from '@nestjs/core';
// 内部依赖
import { AppModule } from './app.module';

/**项目启动函数 */
async function bootstrap() {
  /**应用对象 */
  const app = await NestFactory.createApplicationContext(AppModule);
  // 激活终止信号侦听器
  app.enableShutdownHooks();
  console.log('job应用启动完成');
  console.log('环境变量', process.env);
}
bootstrap();
