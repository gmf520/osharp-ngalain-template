import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { AdminComponentBase } from '@osharp';

@Component({
  selector: 'admin-audit-entity',
  templateUrl: './audit-entity.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditEntityComponent extends AdminComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
    this.moduleName = 'auditEntity';
  }
  ngOnInit(): void {
    super.InitBase();
  }

  protected GetSTColumns(): Array<STColumn<any>> {
    throw new Error('Method not implemented.');
  }
}
