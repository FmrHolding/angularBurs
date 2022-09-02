import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BursRoutingModule } from './burs-routing.module';
import { BursComponent } from './burs.component';


@NgModule({
  declarations: [
    BursComponent
  ],
  imports: [
    CommonModule,
    BursRoutingModule
  ]
})
export class BursModule { }
