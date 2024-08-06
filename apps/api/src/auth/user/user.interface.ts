/**用户配置 */
export interface UserConfig {
  [key: string]: any;
  /**允许密码登陆 */
  pswLogin?: boolean;
  /**允许扫码登陆 */
  qrLogin?: boolean;
  /**允许APP登陆 */
  appLogin?: boolean;
}
