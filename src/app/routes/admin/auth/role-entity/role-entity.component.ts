import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { AdminComponentBase } from '@osharp';

@Component({
  selector: 'admin-auth-role-entity',
  templateUrl: './role-entity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleEntityComponent extends AdminComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
    this.moduleName = 'roleentity';
  }

  ngOnInit(): void {
    super.InitBase();
  }
  protected GetSTColumns(): Array<STColumn<any>> {
    throw new Error('Method not implemented.');
  }
}
