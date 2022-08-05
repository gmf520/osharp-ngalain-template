import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { AdminIdentityRoutingModule } from './admin-identity-routing.module';
import { RoleComponent } from './role/role.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [RoleComponent, UserComponent, UserRoleComponent],
  imports: [CommonModule, SharedModule, AdminIdentityRoutingModule]
})
export class AdminIdentityModule {}
