import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OgrenciDetayComponent } from './ogrenci-detay.component';

const routes: Routes = [{
  path:'',component:OgrenciDetayComponent,
  title:'Öğrenci Detay Formu'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OgrenciDetayRoutingModule { }
