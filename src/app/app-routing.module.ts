import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KvkkComponent } from './kvkk/kvkk.component';

const routes: Routes = [
  {
    path: '', component: KvkkComponent,
    data: { title: 'KVKK Onay Formu' }
  }, {
    path: 'kvkk', loadChildren: () =>
      import('./kvkk/kvkk.module').then(m => m.KvkkModule)
  }, {
    path: 'burs', loadChildren: () =>
      import('./burs/burs.module').then(m => m.BursModule)
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
