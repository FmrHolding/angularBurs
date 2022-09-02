import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OgrenciDetayRoutingModule } from './ogrenci-detay-routing.module';
import { OgrenciDetayComponent } from './ogrenci-detay.component';


@NgModule({
  declarations: [
    OgrenciDetayComponent
  ],
  imports: [
    CommonModule,
    OgrenciDetayRoutingModule
  ]
})
export class OgrenciDetayModule { }
