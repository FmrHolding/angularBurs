import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OgrenciDetayRoutingModule } from './ogrenci-detay-routing.module';
import { OgrenciDetayComponent } from './ogrenci-detay.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    OgrenciDetayComponent
  ],
  imports: [
    CommonModule,
    OgrenciDetayRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class OgrenciDetayModule { }
