import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';

import { OsharpModule } from './osharp/osharp.module';
import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';

// #region third libs

const THIRDMODULES = [OsharpModule];

// #endregion

// #region your componets & directives

const COMPONENTS: Array<Type<any>> = [];
const DIRECTIVES: Array<Type<any>> = [];

// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    DelonFormModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ]
})
export class SharedModule {}
