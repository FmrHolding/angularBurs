import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ParametreService } from 'src/app/services/parametre.service';
import { UniversiteService } from 'src/app/services/universite.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ogrenci-universite',
  templateUrl: './ogrenci-universite.component.html'
})

export class OgrenciUniversiteComponent implements OnInit, OnDestroy, AfterViewInit {

  frmUniversite: FormGroup;
  EdittoUpdate: boolean = false;
  universite: boolean = false;
  submitted = false;
  universitler: any[];
  siniflar: any[];
  fakulteler: any[];
  turler: any = [];
  burslar: any = [];
  private ngUnsubscribe$ = new Subject<void>();

  @Input() data: any = [];
  @Output() tabToUpdate: EventEmitter<any> = new EventEmitter();

  @ViewChild('ngUniversite', { static: true }) ngUniversite: NgSelectComponent;
  @ViewChild('ngFakulte', { static: true }) ngFakulte: NgSelectComponent;
  @ViewChild('ngSinif', { static: true }) ngSinif: NgSelectComponent;
  @ViewChild('ngTuru', { static: true }) ngTuru: NgSelectComponent;
  @ViewChild('ngBurs', { static: true }) ngBurs: NgSelectComponent;

  constructor(
    private fb: FormBuilder,
    private parameterService: ParametreService,
    private universiteService: UniversiteService,
    private toastr: ToastrService
  ) {
    this.frmUniversite = this.fb.group({
      id: [0],
      ogrenciid: [0, [Validators.required]],
      universiteid: ['', [Validators.required]],
      fakulteid: ['', [Validators.required]],
      bolum: ['', [Validators.required]],
      sinifid: ['', [Validators.required]],
      turid: ['', [Validators.required]],
      bursid: ['', [Validators.required]],
      okuyor: [true]
    });
  }

  ngOnInit(): void {
    if (this.data[0].islemId === 2) {
      this.getViewUniversite(this.data[0].ogrenciId);
    }
    this.frmUniversite.get('ogrenciid').setValue(this.data[0].ogrenciId);
    setTimeout(() => {
      this.getViewTur();
      this.getViewBurs();
    }, 0);

    localStorage.setItem('universite', 'true');
    localStorage.setItem('transkrip', 'true');
  }

  get getControlRequest() { return this.frmUniversite.controls; }

  ngAfterViewInit(): void {
    this.getViewUniversiteler();
    this.getViewFakulte();
    this.getViewSinif();
  }

  getViewUniversite(ogrenciid: number): void {
    this.universiteService.getUniversite(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.value != null) {
          this.EdittoUpdate = true;
          this.frmUniversite.patchValue(data.value);
          if (parseInt(data.value.turid) === 1) {
            this.ngBurs.setDisabledState(true);
          } else {
            this.ngBurs.setDisabledState(false);
          }
          this.ValidatorsControl(data.value.okuyor);
        } else {
          this.ngUniversite.handleClearClick();
          this.ngFakulte.handleClearClick();
          this.ngSinif.handleClearClick();
          this.ngTuru.handleClearClick();
          this.ngBurs.handleClearClick();
          this.ngBurs.setDisabledState(true);
          this.EdittoUpdate = false;
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewUniversiteler(): void {
    this.parameterService.getUniversite().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.statusCode === 200 && data.value != null) {
          this.universitler = data.value;;
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewFakulte(): void {
    this.parameterService.getFakulte().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.statusCode === 200 && data.value != null) {
          this.fakulteler = data.value;
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewSinif(): void {
    this.parameterService.getSinif().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.statusCode === 200 && data.value != null) {
          this.siniflar = data.value;
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewTur(): void {
    this.turler = [
      { id: 1, turu: 'Devlet Üniversitesi' },
      { id: 2, turu: 'Vakıf (Özel) Üniversitesi' }
    ]
  }

  getViewBurs(): void {
    this.burslar = [
      { id: 1, burs: "%100 Burslu" },
      { id: 2, burs: "%75 Burslu" },
      { id: 3, burs: "%50 Burslu" },
      { id: 4, burs: "%25 Burslu" },
      { id: 5, burs: "%0 (Ücretli Okuyorum)" }
    ]
  }

  onUniversite(event): void {
    if (event !== undefined) {
      this.frmUniversite.get('universiteid').setValue(event.id);
    } else {
      this.frmUniversite.get('universiteid').setValue(null);
    }
  }

  onFakulte(event): void {
    if (event !== undefined) {
      this.frmUniversite.get('fakulteid').setValue(event.id);
    } else {
      this.frmUniversite.get('fakulteid').setValue(null);
    }
  }

  onSinif(event): void {
    if (event !== undefined) {
      this.frmUniversite.get('sinifid').setValue(event.id);
      if (parseInt(event.id) > 3 && parseInt(event.id) < 15) {
        localStorage.setItem('transkrip', 'true');
      } else {
        localStorage.setItem('transkrip', 'false');
      }
    } else {
      this.frmUniversite.get('sinifid').setValue(null);
      localStorage.setItem('transkrip', 'false');
    }
  }

  onTuru(event): void {
    if (event !== undefined) {
      this.frmUniversite.get('turid').setValue(event.id);
      if (event.id === 1) {
        this.ngBurs.setDisabledState(true);
        this.frmUniversite.get('bursid').setValue(5);
      } else {
        this.ngBurs.setDisabledState(false);
        this.frmUniversite.get('bursid').setValue(null);
      }
    } else {
      this.frmUniversite.get('turid').setValue(null);
      this.ngBurs.setDisabledState(false);
      this.frmUniversite.get('bursid').setValue(null);
    }
  }

  onBurs(event): void {
    if (event !== undefined) {
      this.frmUniversite.get('bursid').setValue(event.id);
    } else {
      this.frmUniversite.get('bursid').setValue(null);
    }
  }

  isChecked(event): void {
    if (event.target.checked) {
      this.frmUniversite.get('okuyor').setValue(true);
      localStorage.setItem('universite', 'false');
      localStorage.setItem('transkrip', 'false');
    } else {
      this.frmUniversite.get('okuyor').setValue(false);
      localStorage.setItem('universite', 'true');
      localStorage.setItem('transkrip', 'true');
    }
    this.ValidatorsControl(event.target.checked);
  }

  ValidatorsControl(value: boolean) {
    if (value) {
      this.frmUniversite.get('universiteid').clearValidators();
      this.frmUniversite.get('universiteid').setValue(null);
      this.frmUniversite.get('fakulteid').clearValidators();
      this.frmUniversite.get('fakulteid').setValue(null);
      this.frmUniversite.get('bolum').clearValidators();
      this.frmUniversite.get('bolum').setValue(null);
      this.frmUniversite.get('sinifid').clearValidators();
      this.frmUniversite.get('sinifid').setValue(null);
      this.frmUniversite.get('turid').clearValidators();
      this.frmUniversite.get('turid').setValue(null);
      this.frmUniversite.get('bursid').clearValidators();
      this.frmUniversite.get('bursid').setValue(null);
      this.ngUniversite.handleClearClick();
      this.ngFakulte.handleClearClick();
      this.ngSinif.handleClearClick();
      this.ngTuru.handleClearClick();
      this.ngBurs.handleClearClick();
      this.ngBurs.setDisabledState(true);
    } else {
      this.frmUniversite.controls['universiteid'].setValidators([Validators.required]);
      this.frmUniversite.controls['universiteid'].updateValueAndValidity();
      this.frmUniversite.controls['fakulteid'].setValidators([Validators.required]);
      this.frmUniversite.controls['fakulteid'].updateValueAndValidity();
      this.frmUniversite.controls['bolum'].setValidators([Validators.required]);
      this.frmUniversite.controls['bolum'].updateValueAndValidity();
      this.frmUniversite.controls['sinifid'].setValidators([Validators.required]);
      this.frmUniversite.controls['sinifid'].updateValueAndValidity();
      this.frmUniversite.controls['turid'].setValidators([Validators.required]);
      this.frmUniversite.controls['turid'].updateValueAndValidity();
      this.frmUniversite.controls['bursid'].setValidators([Validators.required]);
      this.frmUniversite.controls['bursid'].updateValueAndValidity();
    }
  }

  insertBilgi(): void {
    this.submitted = true;
    if (this.frmUniversite.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Üniversite Bilgi Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          this.universiteService.setUniversiteKayit(this.frmUniversite.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 201) {
                this.tabToUpdate.emit({ tabName: "Banka" });
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
    if (this.frmUniversite.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Üniversite Bilgi Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          this.universiteService.setUniversiteGuncelle(this.frmUniversite.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 200) {
                this.tabToUpdate.emit({ tabName: "Banka" });
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
    this.tabToUpdate.emit({ tabName: "Lise" });
  }

  nextBilgi(): void {
    this.tabToUpdate.emit({ tabName: "Banka" });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
