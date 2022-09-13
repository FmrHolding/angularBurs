import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
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
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    $('#modalDuyuru').modal('show');
    localStorage.removeItem('kvkkOnay');
  }

  onModalKapat(): void {
    $('#modalDuyuru').modal('hide');
  }

  isChecked(event): void {
    if (event.target.checked) {
      localStorage.setItem('kvkkOnay', 'true');
    } else {
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
