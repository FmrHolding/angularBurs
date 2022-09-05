import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { CihazipService } from '../services/cihazip.service';

@Component({
  selector: 'app-kvkk',
  templateUrl: './kvkk.component.html',
  styles: [
  ]
})
export class KvkkComponent implements OnInit {

  public kvkkOnay: boolean;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private ipService: CihazipService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('kvkkOnay');
    this.kvkkOnay = false;
    this.getIP();
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
      this.kvkkOnay = true;
      localStorage.setItem('kvkkOnay', 'true');
    } else {
      this.kvkkOnay = false;
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
