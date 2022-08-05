import { ViewChild, Injector } from '@angular/core';
import { STComponent, STData, STPage, STReq, STRes } from '@delon/abc/st';
import { SFSchema, SFUISchema } from '@delon/form';
import { AlainService, OsharpService } from '@osharp';
import { NzModalComponent } from 'ng-zorro-antd/modal';

import { OsharpSTColumn } from '../alain.types';
import { PageRequest } from '../osharp.types';

export abstract class STComponentBase {
  moduleName!: string;

  //URL
  readUrl!: string;
  createUrl?: string;
  updateUrl?: string;
  deleteUrl?: string;

  //表格属性
  columns!: OsharpSTColumn[];
  request!: PageRequest;
  req!: STReq;
  res!: STRes;
  page!: STPage;
  @ViewChild('st', { static: false }) st!: STComponent;

  //编辑属性
  schema?: SFSchema;
  ui?: SFUISchema;
  editRow?: STData;
  editTitle? = '编辑';
  @ViewChild('modal', { static: false }) editModal?: NzModalComponent;

  constructor(private injector: Injector) {}

  get osharp(): OsharpService {
    return this.injector.get(OsharpService);
  }

  get alain(): AlainService {
    return this.injector.get(AlainService);
  }
}
