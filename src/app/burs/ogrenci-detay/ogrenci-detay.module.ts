import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OgrenciDetayRoutingModule } from './ogrenci-detay-routing.module';
import { OgrenciDetayComponent } from './ogrenci-detay.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { OgrenciBankaComponent } from './ogrenci-banka/ogrenci-banka.component';
import { OgrenciEvrakComponent } from './ogrenci-evrak/ogrenci-evrak.component';
import { OgrenciKardesComponent } from './ogrenci-kardes/ogrenci-kardes.component';
import { OgrenciKisiselComponent } from './ogrenci-kisisel/ogrenci-kisisel.component';
import { OgrenciLiseComponent } from './ogrenci-lise/ogrenci-lise.component';
import { OgrenciUniversiteComponent } from './ogrenci-universite/ogrenci-universite.component';
import { OgrenciReferansComponent } from './ogrenci-referans/ogrenci-referans.component';
import { OgrenciEkonomikComponent } from './ogrenci-ekonomik/ogrenci-ekonomik.component';

@NgModule({
  declarations: [
    OgrenciDetayComponent,
    OgrenciBankaComponent,
    OgrenciEvrakComponent,
    OgrenciKardesComponent,
    OgrenciKisiselComponent,
    OgrenciLiseComponent,
    OgrenciUniversiteComponent,
    OgrenciReferansComponent,
    OgrenciEkonomikComponent
  ],
  imports: [
    CommonModule,
    OgrenciDetayRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class OgrenciDetayModule { }
