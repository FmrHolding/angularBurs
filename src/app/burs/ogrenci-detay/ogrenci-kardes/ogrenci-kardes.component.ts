import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { KardesService } from 'src/app/services/kardes.service';
import { ToastrService } from 'ngx-toastr';
import { ColumnMode } from '@swimlane/ngx-datatable';
registerLocaleData(localeTr, 'tr');
declare var $: any;

@Component({
  selector: 'app-ogrenci-kardes',
  templateUrl: './ogrenci-kardes.component.html'

})
export class OgrenciKardesComponent implements OnInit {

  frmKardes: FormGroup;
  EdittoUpdate: boolean = false;
  submitted = false;
  ColumnMode = ColumnMode;
  rows: any = [];
  medenidurumlar: any = [];
  private ngUnsubscribe$ = new Subject<void>();

  @Input() ogrenciId: number;
  @Output() tabToUpdate: EventEmitter<any> = new EventEmitter();

  constructor(
    private kardesService: KardesService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.frmKardes = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      adisoyadi: ['', [Validators.required]],
      yas: ['', [Validators.required]],
      medenihalid: ['', [Validators.required]],
      okul: ['', [Validators.required]],
      gelirburs: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getViewKardes(this.ogrenciId)
    this.frmKardes.get('ogrenciid').setValue(this.ogrenciId);
  }

  get getControlRequest() { return this.frmKardes.controls; }

  getViewKardes(ogrenciid: number): void {
    this.kardesService.getKardesler(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.value != null) {
          this.EdittoUpdate = true;
          this.frmKardes.patchValue(data.value);
          this.rows=data.value;
        } else {
          this.EdittoUpdate = false;
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
    this.rows.push(this.frmKardes.value);
    this.rows = [...this.rows];
  }

  onDelete(index): void {
    this.rows.splice(index, 1);
    this.rows = [...this.rows];
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
          this.rows.forEach(element => {
            this.kardesService.setKardesKayit(element).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
              next: (data: any) => {
                if (data.statusCode === 201) {
                  this.tabToUpdate.emit({ tabName: "Kisisel" });
                  this.EdittoUpdate = true;
                  this.toastr.success(data.message, 'Bilgilendirme');
                } else {
                  this.toastr.error(data.message, 'Hata');
                }
              },
              error: (err) => this.toastr.error(err, 'Hata')
            });
          });          
        }
      });
    }
  }

  updateBilgi(): void {
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
          this.kardesService.setKardesGuncelle(this.rows).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 200) {
                this.tabToUpdate.emit({ tabName: "Kisisel" });
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
    $('#modalKardes').modal('hide');
  }
}
