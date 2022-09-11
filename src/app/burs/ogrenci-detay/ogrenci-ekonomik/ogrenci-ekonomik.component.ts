import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ParametreService } from 'src/app/services/parametre.service';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { SosyoekonomikService } from 'src/app/services/sosyoekonomik.service';
registerLocaleData(localeTr, 'tr');

@Component({
  selector: 'app-ogrenci-ekonomik',
  templateUrl: './ogrenci-ekonomik.component.html'
})
export class OgrenciEkonomikComponent implements OnInit, OnDestroy {

  frmEkonomik: FormGroup;
  EdittoUpdate: boolean = false;
  submitted = false;
  ailebirliktelik: any = [];
  hayat: any = [];
  mulk: any = [];
  ogrenimler: any = [];
  aileberaber: any = [];
  ailedenberaber: any = [];
  ikametedilecekyer: any = [];
  anneolu: boolean = false;
  babaolu: boolean = false;
  private ngUnsubscribe$ = new Subject<void>();

  @Input() ogrenciId: number;
  @Output() tabToUpdate: EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ngAnneBabaBirlikte', { static: true }) ngAnneBabaBirlikte: NgSelectComponent;
  @ViewChild('ngHayat', { static: true }) ngHayat: NgSelectComponent;
  @ViewChild('ngOgrenim', { static: true }) ngOgrenim: NgSelectComponent;
  @ViewChild('ngMulk', { static: true }) ngMulk: NgSelectComponent;

  constructor(
    private ekonomikService: SosyoekonomikService,
    private parameterService: ParametreService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.frmEkonomik = this.fb.group({
      id: [0, [Validators.required]],
      ogrenciid: [0, [Validators.required]],
      annebabaayri: ['', [Validators.required]],
      babasag: ['', [Validators.required]],
      babaogrenimid: ['', [Validators.required]],
      babatelefon: ['', [Validators.required]],
      babameslek: ['', [Validators.required]],
      babamaas: ['', [Validators.required]],
      annesag: ['', [Validators.required]],
      anneogrenimid: ['', [Validators.required]],
      annetelefon: ['', [Validators.required]],
      annemeslek: ['', [Validators.required]],
      annemaas: ['', [Validators.required]],
      digergelir: [, [Validators.required]],
      geliraciklama: ['', [Validators.required]],
      ailesaglik: ['', [Validators.required]],
      veliadres: ['', [Validators.required]],
      sabittelefon: [''],
      mulkid: ['', [Validators.required]],
      kira: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getViewSosyoEkonomik(this.ogrenciId);
    this.frmEkonomik.get('ogrenciid').setValue(this.ogrenciId);
    this.getViewAnneBabaBirlikte();
    this.getViewHayat();
    this.getViewOgrenimler();
    this.getViewMulk();
  }

  get getControlRequest() { return this.frmEkonomik.controls; }

  getViewSosyoEkonomik(ogrenciid: number): void {
    this.ekonomikService.getEkonomik(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.value != null) {
          this.EdittoUpdate = true;
          this.frmEkonomik.patchValue(data.value);
        } else {
          this.EdittoUpdate = false;
          this.ngAnneBabaBirlikte.handleClearClick();
          this.ngHayat.handleClearClick();
          this.ngOgrenim.handleClearClick();
          this.ngMulk.handleClearClick();
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewAnneBabaBirlikte(): void {
    this.ailebirliktelik = [
      { id: 1, cevap: true, aciklama: 'Evet' },
      { id: 2, cevap: false, aciklama: 'Hayır' }
    ];
  }

  getViewHayat(): void {
    this.hayat = [
      { id: 1, cevap: true, aciklama: 'Evet' },
      { id: 2, cevap: false, aciklama: 'Hayır' }
    ];
  }

  getIkametEdilecekYer(): void {
    this.parameterService.getMulk().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.ikametedilecekyer = data.value;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewOgrenimler(): void {
    this.parameterService.getMezuniyet().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.ogrenimler = data.value;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewMulk(): void {
    this.mulk = [
      { id: 1, durumu: 'Mülk' },
      { id: 2, durumu: 'Kira' },
      { id: 3, durumu: 'Lojman' }
    ];
  }

  onBabaHayat(event): void {
    if (event !== undefined) {
      this.frmEkonomik.get('babasag').setValue(event.cevap);
    } else {
      this.frmEkonomik.get('babasag').setValue(event.cevap);
    }
  }

  onAnneHayat(event): void {
    if (event !== undefined) {
      this.frmEkonomik.get('annesag').setValue(event.cevap);
    } else {
      this.frmEkonomik.get('annesag').setValue(event.cevap);
    }
  }

  onAnneBabaBirliktelik(event): void {
    if (event !== undefined) {
      this.frmEkonomik.get('annebabaayri').setValue(event.cevap);
    } else {
      this.frmEkonomik.get('annebabaayri').setValue(event.cevap);
    }
  }

  onBabaOgrenim(event): void {
    if (event !== undefined) {
      this.frmEkonomik.get('babaogrenimid').setValue(event.id);
    } else {
      this.frmEkonomik.get('babaogrenimid').setValue(null);
    }
  }

  onAnneOgrenim(event): void {
    if (event !== undefined) {
      this.frmEkonomik.get('anneogrenimid').setValue(event.id);
    } else {
      this.frmEkonomik.get('anneogrenimid').setValue(null);
    }
  }

  onMulkDurum(event): void {
    if (event !== undefined) {
      this.frmEkonomik.get('mulkid').setValue(event.id);
    } else {
      this.frmEkonomik.get('mulkid').setValue(null);
    }
    this.frmEkonomik.get('kira').setValue(0)
    this.setKiraValidators();
  }

  setKiraValidators() {
    this.frmEkonomik.get('mulkid').valueChanges.subscribe(mulk => {
      console.log(mulk);
      if (mulk === 1) {
        this.frmEkonomik.get('kira').setValidators(Validators.required)
      } else {
        this.frmEkonomik.get('kira').clearValidators();
      }
    });
  }

  insertBilgi(): void {
    this.submitted = true;
    if (this.frmEkonomik.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Sosyo-Ekonomik Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          this.ekonomikService.setEkonomikKayit(this.frmEkonomik.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 201) {
                this.tabToUpdate.emit({ tabName: "Kardes" });
                this.EdittoUpdate=true;
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
    if (this.frmEkonomik.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Sosyo-Ekonomik Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          this.ekonomikService.setEkonomikGuncelle(this.frmEkonomik.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 200) {
                this.tabToUpdate.emit({ tabName: "Kardes" });
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

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
