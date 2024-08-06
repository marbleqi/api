// 外部依赖
import { Injectable } from '@nestjs/common';
// 内部依赖
import { SettingEntity, RedisService, SettingService } from '@libs/shared';
import { UserEntity, UserService } from '../auth';

/**认证服务 */
@Injectable()
export class PassportService {
  /**
   * 构造函数
   * @param httpSrv 注入的http服务
   * @param entityManager 注入的实体管理器服务
   * @param redis 注入的缓存服务
   * @param common 注入的通用服务
   * @param settingSrv 注入的共享配置服务
   * @param wxworkService 注入的企业微信服务
   * @param dingtalkService 注入的钉钉服务
   */
  constructor(
    private readonly settingSrv: SettingService,
    private readonly userSrv: UserService,
  ) {}

  /**
   * 获取初始化参数
   * @returns 响应消息
   */
  async startup(): Promise<any> {
    const system: SettingEntity = this.settingSrv.get('system');
    return system.value;
  }

  /**
   * 用户名密码登陆验证
   * @param loginName 登陆名
   * @param loginPsw 登陆密码明文
   * @param loginIp 登陆IP
   * @returns 响应消息
   */
  async login(
    loginName: string,
    loginPsw: string,
    loginIp: string,
  ): Promise<any> {
    return { code: 0, msg: 'ok', data: { token: '123456' } };
  }
}
