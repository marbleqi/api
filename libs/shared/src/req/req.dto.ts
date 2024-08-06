/**请求日志搜索条件DTO */
export class ReqDto {
  /**用户ID */
  userId: number;

  /**模块名 */
  module: string;

  /**控制器名 */
  controller: string;

  /**方法名 */
  action: string;

  /**状态码 */
  status: number;

  /**开始时间 */
  startAt: number;

  /**结束时间 */
  endAt: number;
}
