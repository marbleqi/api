// 外部依赖
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
// 内部依赖
import { InstanceService } from '..';

@Injectable()
export class ObjectService {
  /**
   * 构造函数
   * @param httpSrv http服务
   * @param instanceSrv 站点服务
   */
  constructor(
    private readonly httpSrv: HttpService,
    private readonly instanceSrv: InstanceService,
  ) {}

  /**
   * 获取对象接口记录
   * @param instanceId 实例ID
   * @param objectType 对象类型
   * @returns 响应消息
   */
  async list(instanceId: number, objectType: string) {
    /**实例对象 */
    const instance = await this.instanceSrv.show(instanceId);
    console.debug('实例对象', instance);
    /**接口调用结果 */
    let next: any = await firstValueFrom(
      this.httpSrv.get(`${instance.url}/${objectType}`, {
        validateStatus: () => true,
      }),
    );
    let apidata: any[] = next.data.data;
    console.debug('首页数据', next.status, next.data);
    if (next.status >= 400) {
      throw new HttpException(next.data.message, next.status);
    }
    // 当对象不止一页时轮询获取
    while (next.data.offset) {
      next = await firstValueFrom(
        this.httpSrv.get(`${instance.url}${next.data.next}`, {
          validateStatus: () => true,
        }),
      );
      console.debug('后续页数据', next.status, next.data);
      if (next.status >= 400) {
        throw new HttpException(next.data.message, next.status);
      }
      apidata = apidata.concat(next.data.data);
    }
    console.debug('最终数据', apidata);
    return apidata;
  }

  /**
   * 获取对象接口详情
   * @param instanceId 实例ID
   * @param objectType 对象类型
   * @param id 对象ID
   * @returns 响应消息
   */
  async get(instanceId: number, objectType: string, id: string) {
    /**实例对象 */
    const instance = await this.instanceSrv.show(instanceId);
    console.debug('实例对象', instance);
    /**接口调用结果 */
    const result = await firstValueFrom(
      this.httpSrv.get(`${instance.url}/${objectType}/${id}`, {
        validateStatus: () => true,
      }),
    );
    console.debug('对象详情', result.data);
    if (result.status >= 400) {
      throw new HttpException(result.data.message, result.status);
    }
    const data: any =
      result.status >= 200 && result.status < 300 ? result.data : null;
    return data;
  }

  /**
   * 获取接口已启用插件
   * @param instanceId 实例ID
   * @returns 响应消息
   */
  async plugin(instanceId: number) {
    /**实例对象 */
    const instance = await this.instanceSrv.show(instanceId);
    console.debug('实例对象', instance);
    /**接口调用结果 */
    const result = await firstValueFrom(
      this.httpSrv.get(`${instance.url}/plugins/enabled`, {
        validateStatus: () => true,
      }),
    );
    if (result.status >= 400) {
      throw new HttpException(result.data.message, result.status);
    }
    const data: any =
      result.status >= 200 && result.status < 300
        ? result.data.enabled_plugins
        : null;
    return data;
  }

  /**
   * 创建对象
   * @param instanceId 实例ID
   * @param objectType 对象类型
   * @param value 对象信息
   * @returns 响应消息
   */
  async create(instanceId: number, objectType: string, value: any) {
    /**实例对象 */
    const instance = await this.instanceSrv.show(instanceId);
    console.debug('实例对象', instance);
    /**接口调用结果 */
    const result = await firstValueFrom(
      this.httpSrv.post(`${instance.url}/${objectType}`, value, {
        validateStatus: () => true,
      }),
    );
    console.debug('create', result.data);
    if (result.status >= 400) {
      throw new HttpException(result.data.message, result.status);
    }
    const data: any =
      result.status >= 200 && result.status < 300 ? result.data : null;
    return data;
  }

  /**
   * 更新对象
   * @param instanceId 实例ID
   * @param objectType 对象类型
   * @param id 对象ID
   * @param value 对象信息
   * @returns 响应消息
   */
  async update(instanceId: number, objectType: string, id: string, value: any) {
    /**实例对象 */
    const instance = await this.instanceSrv.show(instanceId);
    console.debug('实例对象', instance);
    console.debug('value', value);
    /**接口调用结果 */
    const result = await firstValueFrom(
      this.httpSrv.patch(`${instance.url}/${objectType}/${id}`, value, {
        validateStatus: () => true,
      }),
    );
    console.debug('update', result.data);
    if (result.status >= 400) {
      throw new HttpException(result.data.message, result.status);
    }
    const data: any =
      result.status >= 200 && result.status < 300 ? result.data : null;
    return data;
  }

  /**
   * 删除对象
   * @param instanceId 实例ID
   * @param objectType 对象类型
   * @param id 对象ID
   * @returns 响应消息
   */
  async distory(instanceId: number, objectType: string, id: string) {
    /**实例对象 */
    const instance = await this.instanceSrv.show(instanceId);
    console.debug('实例对象', instance);
    /**接口调用结果 */
    const result = await firstValueFrom(
      this.httpSrv.delete(`${instance.url}/${objectType}/${id}`, {
        validateStatus: () => true,
      }),
    );
    console.debug('distory', result);
    if (result.status >= 400) {
      throw new HttpException(result.data.message, result.status);
    }
    const data: any =
      result.status >= 200 && result.status < 300 ? result.data : null;
    return data;
  }
}
