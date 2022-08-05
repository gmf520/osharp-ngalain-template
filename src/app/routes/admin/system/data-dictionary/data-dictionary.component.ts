import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { AdminComponentBase } from '@osharp';

@Component({
  selector: 'app-data-dictionary',
  templateUrl: './data-dictionary.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataDictionaryComponent extends AdminComponentBase implements OnInit {
  constructor(injector: Injector) {
    super(injector);
    this.moduleName = 'dataDictionary';
  }
  ngOnInit(): void {
    super.InitBase();
  }

  protected GetSTColumns(): Array<STColumn<any>> {
    throw new Error('Method not implemented.');
  }
}
