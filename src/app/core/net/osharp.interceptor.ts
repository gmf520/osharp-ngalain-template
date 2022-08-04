import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JWTInterceptor, DA_SERVICE_TOKEN, JWTTokenModel, ITokenModel } from '@delon/auth';
import { AlainAuthConfig } from '@delon/util/config';
import { Observable } from 'rxjs';

@Injectable()
export class OsharpInterceptor extends JWTInterceptor {
  override isAuth(options: AlainAuthConfig): boolean {
    this.model = this.injector.get(DA_SERVICE_TOKEN).get<JWTTokenModel>(JWTTokenModel);
    return this.checkJwt(this.model as JWTTokenModel, options.token_exp_offset!);
  }

  override setReq(req: HttpRequest<any>, _options: AlainAuthConfig): HttpRequest<any> {
    if (!this.model || !this.model.token) {
      return req.clone();
    }
    return req.clone({ setHeaders: { Authorization: `Bearer ${this.model.token}` } });
  }

  override intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return super.intercept(req, next);
  }

  private checkJwt(model: JWTTokenModel, offset: number): boolean {
    try {
      //为适配一些url登录不登录都可以发请求、有token就带上的情景，前端无token不视为无权限的情况
      if (!model || !model.token) {
        return true;
      }
      if (!model.isExpired(offset)!) {
        return true;
      }
      if (!model.expired) {
        return false;
      }
      return model.expired! > new Date().valueOf();
    } catch (err) {
      return false;
    }
  }
}
