import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OgrenciEkleComponent } from './ogrenci-ekle.component';

const routes: Routes = [{
  path:'',component:OgrenciEkleComponent,
  title:'Öğrenci Ön Bilgi Formu'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OgrenciEkleRoutingModule { }
