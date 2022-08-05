import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { AdminComponentBase } from '@osharp';

@Component({
  selector: 'admin-auth-module',
  templateUrl: './module.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleComponent extends AdminComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
    this.moduleName = 'module';
  }

  ngOnInit(): void {
    super.InitBase();
  }
  protected GetSTColumns(): Array<STColumn<any>> {
    throw new Error('Method not implemented.');
  }
}
