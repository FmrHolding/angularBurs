import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ParametreService } from 'src/app/services/parametre.service';

@Component({
  selector: 'app-ogrenci-banka',
  templateUrl: './ogrenci-banka.component.html'
})
export class OgrenciBankaComponent implements OnInit,OnDestroy {

  public frmBanka: FormGroup;
  bankalar:any=[];
  private ngUnsubscribe$ = new Subject<void>();
  
  constructor(
    private parameterService:ParametreService,
    private fb: FormBuilder,
    private toastr:ToastrService
  ) {
    this.frmBanka = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      banka: [null, [Validators.required]],
      subekodu: [null, [Validators.required]],
      hesapno: [null, [Validators.required]],
      ibanno: [null, [Validators.required]],
      ibansahibi: [null, [Validators.required]],
      ibansahibitc: [null, [Validators.required]]
    });

  }

  ngOnInit(): void {
  }

  getBankalar(): void {
    this.parameterService.getBankalar().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.bankalar = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  onBanka(event): void {
    if (event !== undefined) {
      this.frmBanka.get('banka').setValue(event.id);
    } else {
      this.frmBanka.get('banka').setValue(null);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next;
    this.ngUnsubscribe$.complete;
  }

}
