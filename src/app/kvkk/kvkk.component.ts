import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { StoreService } from '../services/store.service';
declare var $: any;

@Component({
  selector: 'app-kvkk',
  templateUrl: './kvkk.component.html',
  styles: [
  ]
})
export class KvkkComponent implements OnInit {

  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private localStore:StoreService
  ) { }

  ngOnInit(): void {
    $('#modalDuyuru').modal('show');
    this.localStore.clearData();
  }

  onModalKapat(): void {
    $('#modalDuyuru').modal('hide');
  }

  isChecked(event): void {
    if (event.target.checked) {
      this.localStore.saveData('kvkkOnay','true');
    } else {
      this.localStore.saveData('kvkkOnay','false');
    }
  }

  onOgrenciForm(): void {
    this.router.navigate(['burs/ogrenci']);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
