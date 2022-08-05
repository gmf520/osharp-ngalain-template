import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { AdminAuthRoutingModule } from './admin-auth-routing.module';
import { EntityInfoComponent } from './entity-info/entity-info.component';
import { FunctionComponent } from './function/function.component';
import { ModuleComponent } from './module/module.component';
import { RoleEntityComponent } from './role-entity/role-entity.component';

@NgModule({
  declarations: [ModuleComponent, FunctionComponent, EntityInfoComponent, RoleEntityComponent],
  imports: [CommonModule, SharedModule, AdminAuthRoutingModule]
})
export class AdminAuthModule {}
