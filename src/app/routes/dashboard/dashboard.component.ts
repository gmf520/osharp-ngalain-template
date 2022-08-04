import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService, JWTTokenModel } from '@delon/auth';
import { IdentityService } from '@osharp';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  constructor(
    private identity: IdentityService,
    @Inject(DA_SERVICE_TOKEN) private tokenSrv: ITokenService,
    private cdr: ChangeDetectorRef
  ) {}

  public result = 0;
  get msg() {
    var exp = this.tokenSrv.get<JWTTokenModel>(JWTTokenModel).exp;
    return new Date(exp!).toString();
  }

  public async clickLink() {
    const value = await lastValueFrom(this.identity.http.post('api/test/test02'));
    this.result = value;
    this.cdr.detectChanges();
  }
}
