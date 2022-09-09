import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { CihazipService } from '../services/cihazip.service';
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
    private toastr: ToastrService,
    private ipService: CihazipService
  ) { }

  ngOnInit(): void {
    $('#modalDuyuru').modal('show');
    localStorage.removeItem('kvkkOnay');
    this.getIP();
  }

  onModalKapat(): void {
    $('#modalDuyuru').modal('hide');
  }

  getIP(): void {
    this.ipService.getDeviceIp().pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (data: any) => { },
        error: (err: any) => {
          this.toastr.warning('Remote IP Hata:' + err.message, 'UYARI', { timeOut: 1500 });
        }
      });
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
