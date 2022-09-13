import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { BankaService } from 'src/app/services/banka.service';
import { ParametreService } from 'src/app/services/parametre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ogrenci-banka',
  templateUrl: './ogrenci-banka.component.html'
})
export class OgrenciBankaComponent implements OnInit, OnDestroy {

  public frmBanka: FormGroup;
  EdittoUpdate: boolean = false;
  submitted = false;
  bankalar: any = [];
  private ngUnsubscribe$ = new Subject<void>();

  @Input() data: any = [];
  @Output() tabToUpdate: EventEmitter<any> = new EventEmitter();
  @ViewChild('ngBanka', { static: true }) ngBanka: NgSelectComponent;

  constructor(
    private parameterService: ParametreService,
    private bankaService: BankaService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.frmBanka = this.fb.group({
      id: [0, [Validators.required]],
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
    if (this.data[0].islemId === 2) {
      this.getViewBanka(this.data[0].ogrenciId);
    }
    this.frmBanka.get('ogrenciid').setValue(this.data[0].ogrenciId);
    this.getViewBankalar();
  }

  get getControlRequest() { return this.frmBanka.controls; }

  getViewBanka(ogrenciid: number): void {
    this.bankaService.getBanka(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.value != null) {
          this.EdittoUpdate = true;
          const iban = data.value.iban.substring(2, data.value.iban.length);
          data.value.iban = iban;
          this.frmBanka.patchValue(data.value);
        } else {
          this.EdittoUpdate = false;
          this.ngBanka.handleClearClick();
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewBankalar(): void {
    this.parameterService.getBanka().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.bankalar = data.value;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  onBanka(event): void {
    if (event !== undefined) {
      this.frmBanka.get('bankaid').setValue(event.id);
    } else {
      this.frmBanka.get('bankaid').setValue(null);
    }
  }

  onIbanKontrol(event): void {
    if (event.target.value.length === 32) {
      if (!this.getIbanDogrula(event.target.value)) {
        this.toastr.error("IBAN no doğrulanmadı", 'Hata');
      }
    }
  }

  getIbanDogrula(iban: string): boolean {
    const ulkekodu = iban[0] + iban[1];
    const rezervhane = parseInt(iban[12]);
    if (ulkekodu !== "TR") return false;
    else if (rezervhane != 0) return false;
    else return true;
  }

  onTcKimlikKontrol(event): void {
    if (event.target.value.length === 11) {
      if (!this.getTcKimlikDogrula(event.target.value)) {
        this.toastr.error("TC Kimlik doğrulanmadı", 'Hata');
      }
    }
  }

  getTcKimlikDogrula(tckimlik: string): boolean {
    const bir = parseInt(tckimlik[0]);
    const iki = parseInt(tckimlik[1]);
    const uc = parseInt(tckimlik[2]);
    const dort = parseInt(tckimlik[3]);
    const bes = parseInt(tckimlik[4]);
    const alti = parseInt(tckimlik[5]);
    const yedi = parseInt(tckimlik[6]);
    const sekiz = parseInt(tckimlik[7]);
    const dokuz = parseInt(tckimlik[8]);
    const on = parseInt(tckimlik[9]);
    const onbir = parseInt(tckimlik[10]);

    const tekler = (bir + uc + bes + yedi + dokuz) * 7;
    const ciftler = (iki + dort + alti + sekiz);
    const cikart = tekler - ciftler;
    const mod10bir = cikart % 10;
    const toplam = (bir + iki + uc + dort + bes + alti + yedi + sekiz + dokuz + mod10bir);
    const mod10iki = toplam % 10;
    const soniki = mod10bir + mod10iki;
    const _soniki = on + onbir;
    if (soniki === _soniki) return true;
    else return false;
  }

  insertBilgi(): void {
    this.submitted = true;
    if (this.frmBanka.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Banka Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          this.bankaService.setBankaKayit(this.frmBanka.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 201) {
                this.tabToUpdate.emit({ tabName: "Ekonomik" });
                this.EdittoUpdate = true;
                this.toastr.success(data.message, 'Bilgilendirme');
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

  updateBilgi(): void {
    this.submitted = true;
    if (this.frmBanka.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Banka Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          this.bankaService.setBankaGuncelle(this.frmBanka.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 200) {
                this.tabToUpdate.emit({ tabName: "Ekonomik" });
                this.toastr.success(data.message, 'Bilgilendirme');
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

  backBilgi(): void {
    this.tabToUpdate.emit({ tabName: "Universite" });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
