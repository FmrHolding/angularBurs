import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BursComponent } from './burs.component';

const routes: Routes = [{
  path: '', component: BursComponent,
  title: 'Burs Formu',
  children: [
    {
      path: 'ogrenci', loadChildren: () =>
        import('./ogrenci-ekle/ogrenci-ekle.module').then(m => m.OgrenciEkleModule)
    }, {
      path: 'detay', loadChildren: () =>
        import('./ogrenci-detay/ogrenci-detay.module').then(m => m.OgrenciDetayModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BursRoutingModule { }
