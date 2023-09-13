import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-kvkk',
  templateUrl: './kvkk.component.html',
  styles: [
  ]
})
export class KvkkComponent implements OnInit {

  btnNext: boolean = false;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    $('#modalKvkkDuyuru').modal('show');
    localStorage.clear();
  }

  onModalKapat(): void {
    $('#modalKvkkDuyuru').modal('hide');
  }

  isChecked(event): void {
    if (event.target.checked) {
      this.btnNext = true;
      localStorage.setItem('kvkkOnay', 'true');
    } else {
      this.btnNext = false;
      localStorage.setItem('kvkkOnay', 'false');
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
