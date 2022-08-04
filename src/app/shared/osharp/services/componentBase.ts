import { Injector } from '@angular/core';
import { AuthConfig, OsharpService } from '@osharp';
import { List } from 'linqts';
import { lastValueFrom } from 'rxjs';

export abstract class ComponentBase {
  protected osharp: OsharpService;

  /**
   * 权限字典，以模块代码为键，是否有权限为值
   */
  public auth: any | { [key: string]: boolean } = {};
  private authConfig: AuthConfig | undefined;

  constructor(injector: Injector) {
    this.osharp = injector.get(OsharpService);
  }

  /**
   * 重写以返回权限控制配置信息
   */
  protected abstract AuthConfig(): AuthConfig;

  /**
   * 初始化并执行权限检查，检查结果存储到 this.auth 中
   */
  async checkAuth() {
    if (this.authConfig == null) {
      this.authConfig = this.AuthConfig();
      this.authConfig.funcs.forEach(key => (this.auth[key] = true));
    }
    const position = this.authConfig.position;
    const codes = await lastValueFrom(this.osharp.getAuthInfo());
    if (!codes) {
      return this.auth;
    }
    const list = new List(codes);
    for (const key in this.auth) {
      if (this.auth.hasOwnProperty(key)) {
        let path = key;
        if (!path.startsWith('Root.')) {
          path = `${position}.${path}`;
        }
        this.auth[key] = list.Contains(path);
      }
    }
    return this.auth;
  }
}
