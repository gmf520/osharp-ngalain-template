import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { AdminComponentBase } from '@osharp';

@Component({
  selector: 'admin-identity-user',
  templateUrl: './user.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent extends AdminComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
    this.moduleName = 'user';
  }
  ngOnInit(): void {
    super.InitBase();
  }

  protected GetSTColumns(): Array<STColumn<any>> {
    throw new Error('Method not implemented.');
  }
}
