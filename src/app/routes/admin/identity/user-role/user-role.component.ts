import { Component, OnInit, Injector } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { AdminComponentBase } from '@osharp';

@Component({
  selector: 'admin-identity-user-role',
  templateUrl: './user-role.component.html',
  styles: []
})
export class UserRoleComponent extends AdminComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.InitBase();
  }
  protected GetSTColumns(): Array<STColumn<any>> {
    throw new Error('Method not implemented.');
  }
}
