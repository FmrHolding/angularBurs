import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OgrenciEkleRoutingModule } from './ogrenci-ekle-routing.module';
import { OgrenciEkleComponent } from './ogrenci-ekle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MyDatePickerModule } from 'mydatepicker';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    OgrenciEkleComponent
  ],
  imports: [
    CommonModule,
    OgrenciEkleRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    MyDatePickerModule,
    ToastrModule.forRoot()
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'tr'
  }]
})
export class OgrenciEkleModule { }
