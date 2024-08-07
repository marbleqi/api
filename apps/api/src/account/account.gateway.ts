// 外部依赖
import {
  SubscribeMessage,
  WebSocketServer,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
// 内部依赖
import { QueueService } from '@libs/shared';

@WebSocketGateway({ namespace: 'account', cors: { origin: true } })
export class AccountGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  /**Socket服务端 */
  @WebSocketServer() server: Server;

  /**
   * 构造函数
   * @param queueSrv 注入的队列服务
   */
  constructor(private readonly queueSrv: QueueService) {}

  /**
   * WebSocket初始化处理
   * @param server 服务端对象
   */
  async afterInit(server: any) {
    console.debug('WebSocket监听启动', server.name);
    // 有前端订阅消息时，向前端发送全局消息
    this.queueSrv.webSub.subscribe((res) => {
      console.debug('收到订阅要发布到前端的消息', res);
      this.server.emit(res.name, res.data);
    });
  }

  /**
   * WebSocket有连接接入时处理
   * @param client 客户端对象
   * @param args 请求参数
   */
  async handleConnection(client: any, ...args: any[]) {
    console.debug('有连接主动接入', client.id, args);
  }

  /**
   * WebSocket有连接断开时处理
   * @param client 客户端对象
   */
  async handleDisconnect(client: any) {
    // console.debug(client.id);
    // await this.redis.del('ws:' + client.id);
    console.debug('会话断开', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
