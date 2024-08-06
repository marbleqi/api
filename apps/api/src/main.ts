// 外部依赖
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { json } from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// 内部依赖
import { SharedModule, ReqInterceptor } from '@libs/shared';
import { AppModule } from './app.module';

/**项目启动函数 */
async function bootstrap() {
  /**应用对象 */
  const app = await NestFactory.create(AppModule);
  // 开启全局跨域许可
  app.enableCors({ origin: true });
  // 激活终止信号侦听器
  app.enableShutdownHooks();
  // 设置JSON解析器的限制
  app.use(json({ limit: 1073741824 }));
  const packageJsonPath = path.resolve(__dirname, '../../../package.json');
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  const version = packageJson.version;
  console.log('当前版本号:', version);
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'dev') {
    SwaggerModule.setup(
      'swagger',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('管理平台API')
          .setDescription('管理平台后端API接口文档')
          .setVersion(version)
          .build(),
      ),
    );
  }
  // 开启服务监听
  await app.listen(parseInt(process.env.PORT, 10) || 80);
  console.log('管理平台后端应用启动完成');
  console.log('环境变量', process.env);
}
bootstrap();
