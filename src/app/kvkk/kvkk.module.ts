import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KvkkRoutingModule } from './kvkk-routing.module';
import { KvkkComponent } from './kvkk.component';


@NgModule({
  declarations: [
    KvkkComponent
  ],
  imports: [
    CommonModule,
    KvkkRoutingModule
  ]
})
export class KvkkModule { }
