import { Component, Injector, ViewChild } from '@angular/core';
import { STColumn, STReq, STRes, STPage, STComponent, STData, STChange, STError, STRequestOptions } from '@delon/abc/st';
import { AlainService, OsharpService, OsharpSTColumn, PageRequest } from '@osharp';

@Component({ template: '' })
export abstract class AdminComponentBase {
  moduleName!: string;

  //URL
  readUrl!: string;
  createUrl?: string;
  updateUrl?: string;
  deleteUrl?: string;

  //表格属性
  columns!: STColumn[];
  request!: PageRequest;
  req!: STReq;
  res!: STRes;
  page!: STPage;
  @ViewChild('st', { static: false }) st!: STComponent;

  get osharp(): OsharpService {
    return this.injector.get(OsharpService);
  }

  get alain(): AlainService {
    return this.injector.get(AlainService);
  }

  data: Array<STData | any> = [];
  selecteds: Array<STData | any> = [];

  constructor(private injector: Injector) {}

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
    return field;
    // let column = this.columns.find(m => m.index === field);
    // if (!column || !column.filterIndex) {
    //   return field;
    // }
    // return column.filterIndex;
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
}
