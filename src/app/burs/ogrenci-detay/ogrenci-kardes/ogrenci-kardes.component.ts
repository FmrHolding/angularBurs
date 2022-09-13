import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { KardesService } from 'src/app/services/kardes.service';
import { ToastrService } from 'ngx-toastr';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
registerLocaleData(localeTr, 'tr');
declare var $: any;

@Component({
  selector: 'app-ogrenci-kardes',
  templateUrl: './ogrenci-kardes.component.html'

})
export class OgrenciKardesComponent implements OnInit, OnDestroy {

  frmKardes: FormGroup;
  submitted = false;
  ColumnMode = ColumnMode;
  rows: any = [];
  medenidurumlar: any = [];
  private ngUnsubscribe$ = new Subject<void>();

  @Input() data: any = [];
  @Output() tabToUpdate: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private localStore: StoreService,
    private kardesService: KardesService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.frmKardes = this.fb.group({
      id: [0],
      ogrenciid: [0, [Validators.required]],
      adisoyadi: ['', [Validators.required]],
      yas: ['', [Validators.required]],
      medenihalid: ['', [Validators.required]],
      okul: ['', [Validators.required]],
      gelirburs: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.localStore.getData('kvkkOnay') === 'true') {
      if (this.data[0].islemId === 2) {
        this.getViewKardes(this.data[0].ogrenciId);
      }
      this.frmKardes.get('ogrenciid').setValue(this.data[0].ogrenciId);
    } else {
      this.router.navigate(['/kvkk']);
    }
  }

  get getControlRequest() { return this.frmKardes.controls; }

  getViewKardes(ogrenciid: number): void {
    this.kardesService.getKardesler(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.value != null) {
          this.frmKardes.patchValue(data.value);
          this.rows = data.value;
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewMedeniDurum(): void {
    this.medenidurumlar = [
      { id: 1, durumu: 'Bekar' },
      { id: 2, durumu: 'Evli' },
      { id: 3, durumu: 'Boşanmış' }
    ];
  }

  onYeniKardes(): void {
    this.getViewMedeniDurum();
    $('#modalKardes').modal('show');
  }

  onMedeniDurum(event): void {
    if (event !== undefined) {
      this.frmKardes.get('medenihalid').setValue(event.id);
    } else {
      this.frmKardes.get('medenihalid').setValue(null);
    }
  }

  onKardesEkle(): void {
    this.submitted = true;
    if (this.frmKardes.invalid) {
      return;
    }
    this.insertBilgi();
  }

  onDelete(index, row): void {
    Swal.fire({
      title: 'Kardeş Silme',
      html:row.adisoyadi + ' silinecektir. <br> Onaylıyor musunuz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Vazgeç',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet'
    }).then((result) => {
      if (result.value) {
        this.kardesService.setKardesCikar(row.id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
          next: (data: any) => {
            if (data.statusCode === 200) {
              this.rows.splice(index, 1);
              this.rows = [...this.rows];
              this.toastr.success(data.message, 'Bilgilendirme', { timeOut: 750 });
            } else {
              this.toastr.error(data.message, 'Hata');
            }
          },
          error: (err) => this.toastr.error(err, 'Hata')
        });
      }
    });
  }

  insertBilgi(): void {
    this.submitted = true;
    if (this.frmKardes.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Kardeş Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          this.kardesService.setKardesKayit(this.frmKardes.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 201) {
                this.kardesService.getKardes(data.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
                  next: (data: any) => {
                    if (data.statusCode === 200 && data.value != null) {
                      this.rows.push(data.value);
                      this.rows = [...this.rows];
                      this.toastr.success(data.message, 'Bilgilendirme', { timeOut: 750 });
                      this.frmKardes.reset();
                    } else {
                      this.toastr.error(data.message, 'Hata')
                    }
                  },
                  error: (err) => this.toastr.error(err, 'Hata')
                });
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

  nextBilgi(): void {
    this.tabToUpdate.emit({ tabName: "Kisisel" });
  }

  backBilgi(): void {
    this.tabToUpdate.emit({ tabName: "Ekonomik" });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    $('#modalKardes').modal('hide');
  }
}
