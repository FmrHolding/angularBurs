import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BursRoutingModule } from './burs-routing.module';
import { BursComponent } from './burs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    BursComponent,
    
  ],
  imports: [
    CommonModule,
    BursRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class BursModule { }
