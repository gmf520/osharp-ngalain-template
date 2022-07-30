import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

const DIRECTIVES: Array<Type<any>> = [];
const COMPONENTS: Array<Type<any>> = [];
const SERVICES: Array<Type<any>> = [];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [...DIRECTIVES, ...COMPONENTS],
  providers: [...SERVICES]
})
export class OsharpModule {}
