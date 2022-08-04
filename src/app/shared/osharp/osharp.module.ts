import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IdentityService, OsharpService } from '@osharp';

const DIRECTIVES: Array<Type<any>> = [];
const COMPONENTS: Array<Type<any>> = [];
const SERVICES = [OsharpService, IdentityService];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [...DIRECTIVES, ...COMPONENTS],
  providers: [...SERVICES]
})
export class OsharpModule {}
