import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenModel, ITokenService, JWTTokenModel } from '@delon/auth';
import { CacheService } from '@delon/cache';
import { SettingsService, _HttpClient, MenuService, User } from '@delon/theme';
import { zip, catchError, Observable, map, lastValueFrom } from 'rxjs';

import {
  AdResult,
  AjaxResult,
  AjaxResultType,
  ChangePasswordDto,
  ConfirmEmailDto,
  JsonWebToken,
  LoginDto,
  ProfileEditDto,
  RegisterDto,
  ResetPasswordDto,
  SendMailDto,
  TokenDto,
  UserLoginInfoEx
} from '../osharp.types';
import { OsharpService } from './osharp.services';

@Injectable({ providedIn: 'root' })
export class IdentityService {
  constructor(
    public http: _HttpClient,
    private osharp: OsharpService,
    @Inject(DA_SERVICE_TOKEN) private tokenSrv: ITokenService,
    private cache: CacheService,
    private settingSrv: SettingsService,
    private aclSrv: ACLService,
    private reuseTabSrv: ReuseTabService,
    private menuSrv: MenuService
  ) {}

  get user() {
    return this.settingSrv.user;
  }

  get router(): Router {
    return this.osharp.router;
  }

  token(dto: TokenDto): Observable<AjaxResult> {
    const url = 'api/identity/token';
    return this.http.post<AjaxResult>(url, dto).pipe(
      map(result => {
        if (this.osharp.isSuccessResult(result)) {
          this.loginEnd(result.data as JsonWebToken).subscribe();
        }
        return result;
      })
    );
  }

  login(dto: LoginDto): Observable<AjaxResult> {
    const url = 'api/identity/token';
    return this.http.post<AjaxResult>(url, dto).pipe(
      map(result => {
        if (this.osharp.isSuccessResult(result)) {
          this.loginEnd(result.data as JsonWebToken).subscribe();
        }
        return result;
      })
    );
  }

  logout() {
    const url = 'api/identity/logout';
    return this.http.post<AjaxResult>(url, {}).pipe(
      map(res => {
        if (res.type === AjaxResultType.Success) {
          this.loginEnd(null).subscribe();
        }
        return res;
      })
    );
  }

  register(dto: RegisterDto): Observable<AdResult> {
    const url = 'api/identity/register';
    return this.http.post<AjaxResult>(url, dto).pipe(
      map(res => {
        const result = new AdResult();
        if (res.type === AjaxResultType.Success) {
          const data: any = res.data;
          result.type = 'success';
          result.title = '新用户注册成功';
          result.description = `你的账户：${data.UserName}[${data.NickName}] 注册成功，请及时登录邮箱 ${data.Email} 接收邮件激活账户。`;
          return result;
        }
        result.type = 'error';
        result.title = '用户注册失败';
        result.description = res.content;
        return result;
      })
    );
  }

  loginBind(info: UserLoginInfoEx) {
    const url = 'api/identity/LoginBind';
    return this.http.post<AjaxResult>(url, info).pipe(
      map(result => {
        if (this.osharp.isSuccessResult(result)) {
          this.loginEnd(result.data as JsonWebToken).subscribe();
        }
        return result;
      })
    );
  }

  loginOneKey(info: UserLoginInfoEx) {
    const url = 'api/identity/LoginOneKey';
    return this.http.post<AjaxResult>(url, info).pipe(
      map(result => {
        if (this.osharp.isSuccessResult(result)) {
          this.loginEnd(result.data as JsonWebToken).subscribe();
        }
        return result;
      })
    );
  }

  loginEnd(token: JsonWebToken | null) {
    // 清空路由复用信息
    this.reuseTabSrv.clear();
    // 设置Token
    this.setToken(token);
    // 刷新用户信息
    return this.refreshUser();
  }

  private setToken(token: JsonWebToken | null) {
    if (token) {
      let seconds = new Date().getTime();
      seconds = Math.round((token.refreshUctExpires - seconds) / 1000);

      let model: ITokenModel = { token: token?.accessToken };
      if (seconds > 0) {
        //this.cache.set('refresh_token', token.refreshToken, { expire: seconds });
        model.expired = seconds * 1000;
        model['refresh_token'] = token.refreshToken;
      }
      this.tokenSrv.set(model);
    } else {
      this.tokenSrv.clear();
      //   this.cache.remove('refresh_token');
      this.settingSrv.setUser({});
    }
  }

  getAccessToken(): JWTTokenModel {
    const accessToken = this.tokenSrv.get<JWTTokenModel>(JWTTokenModel);
    return accessToken;
  }

  getRefreshToken(): string {
    const refreshToken = this.cache.getNone<string>('refresh_token');
    return refreshToken;
  }

  /**
   * 尝试刷新AccessToken和RefreshToken，每5秒检测AccessToken有效期，如过期则使用RefreshToken来刷新
   */
  tryRefreshToken() {
    const accessToken = this.getAccessToken();
    if (accessToken && accessToken.token && accessToken.token.includes('.')) {
      const diff = Math.round(accessToken.payload.exp - new Date().getTime() / 1000);
      if (diff > 20) return;
    }
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      // 仅在RefreshToken失效时跳转到登录页
      if (this.router.url === '/exception/403') {
        setTimeout(() => this.router.navigateByUrl('/passport/login'));
      }
      return;
    }
    this.refreshToken(refreshToken).subscribe();
  }

  /**
   * 使用现在的RefreshToken刷新新的AccessToken与RefreshToken
   *
   * @param refreshToken 现有的RefreshToken
   */
  refreshToken(refreshToken: string) {
    // 使用RefreshToken刷新AccessToken
    const dto: TokenDto = { refreshToken: refreshToken, grantType: 'refresh_token' };
    return this.http.post<AjaxResult>('api/identity/token', dto).pipe(
      map(result => {
        if (this.osharp.isSuccessResult(result)) {
          this.setToken(result.data as JsonWebToken);
        } else {
          this.setToken(null);
        }
        return result;
      })
    );
  }

  /**
   * 刷新权限点、用户信息、菜单
   */
  refreshAuth() {
    zip(this.http.get('api/auth/getauthinfo'), this.http.get('api/identity/profile'), this.http.get('assets/osharp/app-data.json'))
      .pipe(
        catchError(([authInfo, userInfo, appData]) => {
          return [authInfo, userInfo, appData];
        })
      )
      .subscribe(([authInfo, userInfo, appData]) => {
        this.aclSrv.setAbility(authInfo);
        if (userInfo && userInfo.UserName) {
          let user: User = { name: userInfo.UserName, avatar: userInfo.HeadImg, email: userInfo.Email, nickName: userInfo.NickName };
          this.settingSrv.setUser(user);
        }
        this.menuSrv.add(appData.menu);
      });
  }

  removeOAuth2(id: string) {
    const url = 'api/identity/RemoveOAuth2';
    return this.http.post<AjaxResult>(url, [id]).pipe(
      map(res => {
        this.osharp.ajaxResult(res);
        return res;
      })
    );
  }

  /** 刷新用户信息 */
  refreshUser(): Observable<User> {
    const url = 'api/identity/profile';
    return this.http.get(url).pipe(
      map((res: any) => {
        if (!res || res === {}) {
          this.settingSrv.setUser({});
          this.aclSrv.setRole([]);
          return {};
        }
        const user: User = {
          id: res.Id,
          name: res.UserName,
          nickName: res.NickName,
          avatar: res.HeadImg,
          email: res.Email,
          roles: res.Roles,
          isAdmin: res.IsAdmin
        };
        this.settingSrv.setUser(user);
        // 更新角色
        this.aclSrv.setRole(user['roles']);
        return user;
      })
    );
  }

  sendConfirmMail(dto: SendMailDto): Observable<AdResult> {
    const url = 'api/identity/SendConfirmMail';
    return this.http.post<AjaxResult>(url, dto).pipe(
      map(res => {
        const result = new AdResult();
        if (res.type !== AjaxResultType.Success) {
          result.type = 'error';
          result.title = '重发激活邮件失败';
          result.description = res.content;
          return result;
        }
        result.type = 'success';
        result.title = '重发激活邮件成功';
        result.description = `注册邮箱激活邮件发送成功，请登录邮箱“${dto.email}”收取邮件进行后续步骤`;
        return result;
      })
    );
  }

  confirmEmail(dto: ConfirmEmailDto): Observable<AdResult> {
    const url = 'api/identity/ConfirmEmail';
    return this.http.post<AjaxResult>(url, dto).pipe(
      map(res => {
        const result = new AdResult();
        if (res.type !== AjaxResultType.Success) {
          result.type = 'error';
          result.title = '注册邮箱激活失败';
          if (res.type === AjaxResultType.Info) {
            result.type = 'minus-circle-o';
          }
          result.title = '注册邮箱激活取消';
          result.description = res.content;
          return result;
        }
        result.type = 'success';
        result.title = '注册邮箱激活成功';
        result.description = res.content;
        return result;
      })
    );
  }

  sendResetPasswordMail(dto: SendMailDto): Observable<AdResult> {
    const url = 'api/identity/SendResetPasswordMail';
    return this.http.post<AjaxResult>(url, dto).pipe(
      map(res => {
        const result = new AdResult();
        if (res.type !== AjaxResultType.Success) {
          result.type = 'error';
          result.title = '重置密码邮件发送失败';
          result.description = res.content;
          return result;
        }
        result.type = 'success';
        result.title = '重置密码邮件发送成功';
        result.description = `重置密码邮件发送成功，请登录邮箱“${dto.email}”收取邮件进行后续步骤`;
        return result;
      })
    );
  }

  resetPassword(dto: ResetPasswordDto): Observable<AdResult> {
    const url = 'api/identity/ResetPassword';
    return this.http.post<AjaxResult>(url, dto).pipe(
      map(res => {
        const result = new AdResult();
        if (res.type !== AjaxResultType.Success) {
          result.type = 'error';
          result.title = '登录密码重置失败';
          result.description = res.content;
          return result;
        }
        result.type = 'success';
        result.title = '登录密码重置成功';
        result.description = '登录密码重置成功，请使用新密码登录系统。';
        return result;
      })
    );
  }

  profileEdit(dto: ProfileEditDto) {
    const url = 'api/identity/ProfileEdit';
    return this.http.post<AjaxResult>(url, dto).subscribe(res => {
      this.osharp.ajaxResult(res);
      this.refreshUser().subscribe();
    });
  }

  changePassword(dto: ChangePasswordDto) {
    const url = 'api/identity/ChangePassword';
    return this.http.post<AjaxResult>(url, dto).subscribe(res => {
      this.osharp.ajaxResult(res);
    });
  }
}
