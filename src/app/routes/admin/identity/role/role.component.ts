import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';
import { AdminComponentBase, OsharpSTColumn } from '@osharp';

@Component({
  selector: 'admin-identity-role',
  templateUrl: './role.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent extends AdminComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
    this.moduleName = 'role';
  }

  ngOnInit(): void {
    super.InitBase();
  }

  protected GetSTColumns(): OsharpSTColumn[] {
    throw new Error('Method not implemented.');
  }
}
