import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditEntityComponent } from './audit-entity/audit-entity.component';
import { AuditOperationComponent } from './audit-operation/audit-operation.component';
import { DataDictionaryComponent } from './data-dictionary/data-dictionary.component';
import { PackComponent } from './pack/pack.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'audit-entity', component: AuditEntityComponent, data: { title: '数据审计管理', reuse: true } },
  { path: 'audit-operation', component: AuditOperationComponent, data: { title: '操作审计管理', reuse: true } },
  { path: 'data-dictionary', component: DataDictionaryComponent, data: { title: '数据字典管理', reuse: true } },
  { path: 'pack', component: PackComponent, data: { title: '模块包管理', reuse: true } },
  { path: 'settings', component: SettingsComponent, data: { title: '系统设置管理', reuse: true } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSystemRoutingModule {}
