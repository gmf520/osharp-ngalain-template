import { ViewChild, Injector } from '@angular/core';
import { STChange, STComponent, STData, STError, STPage, STReq, STRequestOptions, STRes } from '@delon/abc/st';
import { SFSchema, SFSchemaEnumType, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { AlainService, OsharpService } from '@osharp';
import { NzModalComponent } from 'ng-zorro-antd/modal';

import { OsharpSTColumn } from '../alain.types';
import { AjaxResult, PageRequest } from '../osharp.types';

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

  data: Array<STData | any> = [];
  selecteds: Array<STData | any> = [];

  protected InitBase() {
    this.readUrl = `api/admin/${this.moduleName}/read`;
    this.createUrl = `api/admin/${this.moduleName}/create`;
    this.updateUrl = `api/admin/${this.moduleName}/update`;
    this.deleteUrl = `api/admin/${this.moduleName}/delete`;

    this.request = new PageRequest();
    this.columns = this.GetSTColumns();
    this.req = this.GetSTReq(this.request);
    this.res = this.GetSTRes();
    this.page = this.GetSTPage();

    this.schema = this.GetSFSchema();
    this.ui = this.GetSFUISchema();
  }

  // #region 表格

  /**
   * 重写以获取表格的列设置 Columns
   */
  protected abstract GetSTColumns(): OsharpSTColumn[];

  protected GetSTReq(request: PageRequest): STReq {
    return this.alain.GetSTReq(request, opt => this.RequestProcess(opt));
  }

  protected GetSTRes(): STRes {
    return this.alain.GetSTRes(data => this.ResponseDataProcess(data));
  }

  protected GetSTPage(): STPage {
    return this.alain.GetSTPage();
  }

  protected RequestProcess(opt: STRequestOptions): STRequestOptions {
    return this.alain.RequestProcess(opt, field => this.ReplaceFieldName(field));
  }

  protected ResponseDataProcess(data: STData[]): STData[] {
    this.data = data;
    return data;
  }

  protected ReplaceFieldName(field: string): string {
    let column = this.columns.find(m => m.index === field);
    if (!column || !column.filterIndex) {
      return field;
    }
    return column.filterIndex;
  }

  search(request: PageRequest) {
    if (!request) {
      return;
    }
    this.req.body = request;
    this.st.reload();
  }

  change(value: STChange) {
    if (value.type === 'checkbox') {
      this.selecteds = value.checkbox!;
    } else if (value.type === 'radio') {
      this.selecteds = [value.radio];
    }
  }

  error(value: STError) {
    console.error(value);
  }

  // #endregion

  // #region 编辑

  /**
   * 默认由列配置 `OsharpSTColumn[]` 来生成SFSchema，不需要可以重写定义自己的SFSchema
   */
  protected GetSFSchema(): SFSchema {
    let schema: SFSchema = { properties: this.ColumnsToSchemas(this.columns) };
    return schema;
  }

  protected ColumnsToSchemas(columns: OsharpSTColumn[]): { [key: string]: SFSchema } {
    let properties: { [key: string]: SFSchema } = {};
    for (const column of columns) {
      if (!column.index || !column.editable || column.buttons) {
        continue;
      }
      let schema: SFSchema = this.alain.ToSFSchema(column);
      properties[column.index as string] = schema;
    }
    return properties;
  }

  protected GetSFUISchema(): SFUISchema {
    let ui: SFUISchema = {};
    return ui;
  }

  protected toEnum(items: Array<{ id: number; text: string }>): SFSchemaEnumType[] {
    return items.map(item => {
      let e: SFSchemaEnumType = { value: item.id, label: item.text };
      return e;
    });
  }

  create() {
    if (!this.editModal) return;
    this.schema = this.GetSFSchema();
    this.ui = this.GetSFUISchema();
    this.editRow = {};
    this.editTitle = '新增';
    this.editModal.open();
  }

  edit(row: STData) {
    if (!row || !this.editModal) {
      return;
    }
    this.schema = this.GetSFSchema();
    this.ui = this.GetSFUISchema();
    this.editRow = row;
    this.editTitle = '编辑';
    this.editModal.open();
  }

  close() {
    if (!this.editModal) return;
    this.editModal.destroy();
  }

  save(value: STData | any) {
    let url = value.id ? this.updateUrl : this.createUrl;
    this.osharp.http.post<AjaxResult>(url!, [value]).subscribe(result => {
      this.osharp.ajaxResult(result, () => {
        this.st.reload();
        this.editModal?.destroy();
      });
    });
  }

  delete(value: STData | any) {
    if (!value) {
      return;
    }
    this.osharp.http.post<AjaxResult>(this.deleteUrl!, [value.id]).subscribe(result => {
      this.osharp.ajaxResult(result, () => {
        this.st.reload();
      });
    });
  }

  // #endregion
}
