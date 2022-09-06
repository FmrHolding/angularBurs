import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OgrenciEkleRoutingModule } from './ogrenci-ekle-routing.module';
import { OgrenciEkleComponent } from './ogrenci-ekle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MyDatePickerModule } from 'mydatepicker';
import { NgxMaskModule } from 'ngx-mask';

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
    NgxMaskModule.forRoot()
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'tr'
  }]
})
export class OgrenciEkleModule { }
