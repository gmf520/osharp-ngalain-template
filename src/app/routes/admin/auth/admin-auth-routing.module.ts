import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntityInfoComponent } from './entity-info/entity-info.component';
import { FunctionComponent } from './function/function.component';
import { ModuleComponent } from './module/module.component';
import { RoleEntityComponent } from './role-entity/role-entity.component';

const routes: Routes = [
  { path: 'module', component: ModuleComponent, data: { title: '模块信息管理', reuse: true } },
  { path: 'function', component: FunctionComponent, data: { title: '功能信息管理', reuse: true } },
  { path: 'entity-info', component: EntityInfoComponent, data: { title: '实体信息管理', reuse: true } },
  { path: 'role-entity', component: RoleEntityComponent, data: { title: '角色数据权限', reuse: true } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAuthRoutingModule {}
