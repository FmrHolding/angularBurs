import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { LiseService } from 'src/app/services/lise.service';
import { ParametreService } from 'src/app/services/parametre.service';
import Swal from 'sweetalert2';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeTr, 'tr');

@Component({
  selector: 'app-ogrenci-lise',
  templateUrl: './ogrenci-lise.component.html'
})
export class OgrenciLiseComponent implements OnInit, OnDestroy {

  public frmBursLise: FormGroup;
  locale: any = localeTr[0];
  EdittoUpdate: boolean = false;
  submitted = false;
  liseler: any = [];
  liseturler: any = [];
  siniflar: any = [];
  private ngUnsubscribe$ = new Subject<void>();

  @Input() data: any = [];
  @Output() tabToUpdate: EventEmitter<any> = new EventEmitter();

  @ViewChild('ngLise', { static: true }) ngLise: NgSelectComponent;
  @ViewChild('ngLiseTur', { static: true }) ngLiseTur: NgSelectComponent;
  @ViewChild('ngSinif', { static: true }) ngSinif: NgSelectComponent;

  constructor(
    private parameterService: ParametreService,
    private liseService: LiseService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.frmBursLise = this.fb.group({
      id: [0],
      ogrenciid: [0, [Validators.required]],
      liseid: ['', [Validators.required]],
      liseturid: ['', [Validators.required]],
      sinifid: ['', [Validators.required]],
      liseadi: ['', [Validators.required, Validators.maxLength(100)]],
      okuyor: [false]
    });
  }

  ngOnInit(): void {
    if (this.data[0].islemId === 2) {
      this.getViewLise(this.data[0].ogrenciId);
      this.getViewLiseTur();
      this.getViewSinif();
    } else {
      this.getViewLiseTur();
      this.getViewSinif();
    }
    this.frmBursLise.get('ogrenciid').setValue(this.data[0].ogrenciId);
  }

  get getControlRequest() { return this.frmBursLise.controls; }

  getViewLise(ogrenciid: number): void {
    this.liseService.getLise(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.statusCode === 200 && data.value != null) {
          this.EdittoUpdate = true;
          this.frmBursLise.patchValue(data.value);
          this.ValidatorsControl(data.value.okuyor);
          this.getViewLiseler(data.value.liseturid);
        } else {
          this.EdittoUpdate = false;
          this.ngLise.handleClearClick();
          this.ngLiseTur.handleClearClick();
          this.ngSinif.handleClearClick();
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewLiseTur(): void {
    this.parameterService.getLiseTur().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.statusCode === 200) {
          this.liseturler = data.value;
        } else {
          this.toastr.error(data.message, 'Hata')
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewLiseler(turid: number): void {
    this.parameterService.getLise(turid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.statusCode === 200) {
          this.liseler = data.value;
        } else {
          this.toastr.error(data.message, 'Hata')
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewSinif(): void {
    this.siniflar = [
      { id: 11, sinif: '9. Sinif' },
      { id: 12, sinif: '10. Sinif' },
      { id: 13, sinif: '11. Sinif' },
      { id: 14, sinif: '12. Sinif' }
    ];
  }

  onLiseTipi(event): void {
    if (event !== undefined) {
      this.frmBursLise.get('liseid').setValue(event.id);
    } else {
      this.frmBursLise.get('liseid').setValue(null);
    }
  }

  onLiseTuru(event): void {
    if (event !== undefined) {
      this.frmBursLise.get('liseturid').setValue(event.id);
      this.getViewLiseler(event.id);
    } else {
      this.frmBursLise.get('liseturid').setValue(null);
    }
  }

  onSinif(event): void {
    if (event !== undefined) {
      this.frmBursLise.get('sinifid').setValue(event.id);
    } else {
      this.frmBursLise.get('sinifid').setValue(null);
    }
  }

  isChecked(event): void {
    if (event.target.checked) {
      this.frmBursLise.get('okuyor').setValue(true);
    } else {
      this.frmBursLise.get('okuyor').setValue(false);
    }
    this.ValidatorsControl(event.target.checked);
  }

  ValidatorsControl(value: boolean) {
    if (value) {
      this.frmBursLise.get('liseid').clearValidators();
      this.frmBursLise.get('liseid').setValue(null);
      this.frmBursLise.get('liseturid').clearValidators();
      this.frmBursLise.get('liseturid').setValue(null);
      this.frmBursLise.get('sinifid').clearValidators();
      this.frmBursLise.get('sinifid').setValue(null);
      this.frmBursLise.get('liseadi').clearValidators();
      this.frmBursLise.get('liseadi').setValue(null);
      this.ngLise.handleClearClick();
      this.ngLiseTur.handleClearClick();
      this.ngSinif.handleClearClick();
    } else {
      this.frmBursLise.controls['liseid'].setValidators([Validators.required]);
      this.frmBursLise.controls['liseid'].updateValueAndValidity();
      this.frmBursLise.controls['liseturid'].setValidators([Validators.required]);
      this.frmBursLise.controls['liseturid'].updateValueAndValidity();
      this.frmBursLise.controls['sinifid'].setValidators([Validators.required]);
      this.frmBursLise.controls['sinifid'].updateValueAndValidity();
      this.frmBursLise.controls['liseadi'].setValidators([Validators.required, Validators.maxLength(100)]);
      this.frmBursLise.controls['liseadi'].updateValueAndValidity();
    }
  }

  insertBilgi(): void {
    this.submitted = true;
    console.log(this.submitted);
    if (this.frmBursLise.invalid) {
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
          this.liseService.setLiseKayit(this.frmBursLise.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 201) {
                this.EdittoUpdate = true;
                this.tabToUpdate.emit({ tabName: "Universite" });
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
    if (this.frmBursLise.invalid) {
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
          this.liseService.setLiseGuncelle(this.frmBursLise.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 200) {
                this.toastr.success(data.message, 'Bilgilendirme');
                this.tabToUpdate.emit({ tabName: "Universite" });
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