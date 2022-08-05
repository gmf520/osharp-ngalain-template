import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { AdminComponentBase } from '@osharp';

@Component({
  selector: 'admin-auth-entity-info',
  templateUrl: './entity-info.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityInfoComponent extends AdminComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
    this.moduleName = 'entityInfo';
  }

  ngOnInit(): void {
    super.InitBase();
  }
  protected GetSTColumns(): Array<STColumn<any>> {
    throw new Error('Method not implemented.');
  }
}
