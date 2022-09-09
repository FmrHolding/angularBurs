import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { OgrenciService } from 'src/app/services/ogrenci.service';
import { ParametreService } from 'src/app/services/parametre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ogrenci-banka',
  templateUrl: './ogrenci-banka.component.html'
})
export class OgrenciBankaComponent implements OnInit,OnDestroy {

  public frmBanka: FormGroup;
  submitted = false;
  bankalar:any=[];
  private ngUnsubscribe$ = new Subject<void>();
  
  @Input() ogrenciId: number;
  @ViewChild('ngBanka',{static:true}) ngBanka:NgSelectComponent;
  
  constructor(
    private parameterService: ParametreService,
    private ogrenciService: OgrenciService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.frmBanka = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      bankaid: ['', [Validators.required]],
      subekodu: ['', [Validators.required]],
      hesapno: ['', [Validators.required]],
      iban: ['', [Validators.required]],
      ibansahibi: ['', [Validators.required]],
      hesaptc: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
  }

  get getControlRequest() { return this.frmBanka.controls; }

  getBankalar(): void {
    this.parameterService.getBanka().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.bankalar = data.value;
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

  sendBilgi():void{
    this.submitted = true;
    if (this.frmBanka.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Lise Bilgi Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          this.ogrenciService.setBankaKayit(this.frmBanka.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 201) {
                this.toastr.success(data.message, 'Bilgilendirme');
                this.frmBanka.disable();
                this.ngBanka.setDisabledState(true);
              } else {
                this.toastr.error(data.message, 'Hata');
              }
            },
            error: (err) => this.toastr.error(err, 'Hata')
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
