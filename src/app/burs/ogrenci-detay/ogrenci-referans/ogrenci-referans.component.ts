import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ReferansService } from 'src/app/services/referans.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-ogrenci-referans',
  templateUrl: './ogrenci-referans.component.html',
  styles: [
  ]
})
export class OgrenciReferansComponent implements OnInit {

  frmReferans: FormGroup;
  EdittoUpdate: boolean = false;
  submitted = false;
  ColumnMode = ColumnMode;
  rows: any = [];
  medenidurumlar: any = [];
  private ngUnsubscribe$ = new Subject<void>();

  @Input() ogrenciId: number;

  constructor(
    private referansService: ReferansService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.frmReferans = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      adisoyadi: ['', [Validators.required]],
      yakinlik: ['', [Validators.required]],
      gorevi: ['', [Validators.required]],
      ceptelefon: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getViewRerefrans(this.ogrenciId)
    this.frmReferans.get('ogrenciid').setValue(this.ogrenciId);
  }

  get getControlRequest() { return this.frmReferans.controls; }

  getViewRerefrans(ogrenciid: number): void {
    this.referansService.getReferans(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.value != null) {
          this.EdittoUpdate = true;
          this.frmReferans.patchValue(data.value);
          this.rows = data.value;
        } else {
          this.EdittoUpdate = false;
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  onYeniReferans(): void {
    $('#modalReferans').modal('show');
  }

  onReferansEkle(): void {
    this.submitted = true;
    if (this.frmReferans.invalid) {
      return;
    }
    this.rows.push(this.frmReferans.value);
    this.rows = [...this.rows];
  }

  onDelete(index): void {
    this.rows.splice(index, 1);
    this.rows = [...this.rows];
  }

  insertBilgi(): void {
    this.submitted = true;
    if (this.frmReferans.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Referans Kayıt',
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
            this.referansService.setReferansKayit(element).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
              next: (data: any) => {
                if (data.statusCode === 201) {
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
    if (this.frmReferans.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Referans Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          this.referansService.setReferansGuncelle(this.rows).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 200) {
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
    $('#modalReferans').modal('hide');
  }
}
