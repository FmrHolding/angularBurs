import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OgrenciEkleRoutingModule } from './ogrenci-ekle-routing.module';
import { OgrenciEkleComponent } from './ogrenci-ekle.component';


@NgModule({
  declarations: [
    OgrenciEkleComponent
  ],
  imports: [
    CommonModule,
    OgrenciEkleRoutingModule
  ]
})
export class OgrenciEkleModule { }
