import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ReferansService } from 'src/app/services/referans.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-ogrenci-referans',
  templateUrl: './ogrenci-referans.component.html'
})
export class OgrenciReferansComponent implements OnInit, OnDestroy {

  frmReferans: FormGroup;
  EdittoUpdate: boolean = false;
  submitted = false;
  ColumnMode = ColumnMode;
  rows: any = [];
  medenidurumlar: any = [];
  private ngUnsubscribe$ = new Subject<void>();

  @Input() data: any = [];
  @Output() tabToUpdate: EventEmitter<any> = new EventEmitter();

  constructor(
    private referansService: ReferansService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    if (this.data[0].islemId === 2) {
      this.getViewRerefrans(this.data[0].ogrenciId);
    }
    this.setReferansForm();
  }

  setReferansForm(): void {
    this.frmReferans = this.fb.group({
      id: [0],
      ogrenciid: [this.data[0].ogrenciId, [Validators.required]],
      adisoyadi: ['', [Validators.required]],
      yakinlik: ['', [Validators.required]],
      gorevi: ['', [Validators.required]],
      ceptelefon: ['', [Validators.required]]
    });
  }

  get getControlRequest() { return this.frmReferans.controls; }

  getViewRerefrans(ogrenciid: number): void {
    this.referansService.getReferanslar(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
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
    this.setReferansForm();
    $('#modalReferans').modal('show');
  }

  onReferansEkle(): void {
    this.submitted = true;
    if (this.frmReferans.invalid) {
      return;
    }
    this.insertBilgi();
  }

  onDelete(index, row): void {
    Swal.fire({
      title: 'Referans Silme',
      html: row.adisoyadi + ' referansınız silinicektir. <br> Onaylıyor musunuz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Vazgeç',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet'
    }).then((result) => {
      if (result.value) {
        this.referansService.setReferansCikar(row.id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
          next: (data: any) => {
            if (data.statusCode === 200) {
              this.rows.splice(index, 1);
              this.rows = [...this.rows];
              this.EdittoUpdate = true;
              this.toastr.success(data.message, 'Bilgilendirme', { timeOut: 750 });
              this.frmReferans.reset();
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
          this.referansService.setReferansKayit(this.frmReferans.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 201) {
                this.toastr.success(data.message, 'Bilgilendirme', { timeOut: 750 });
                this.rows.push(data.value);
                this.rows = [...this.rows];
                this.frmReferans.reset();
                $('#modalReferans').modal('hide');
                this.EdittoUpdate = true;
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
    if (this.rows.length > 0) {
      this.tabToUpdate.emit({ tabName: "Evrak" });
    } else {
      this.toastr.error("En az bir referans girilmesi zorunludur.", 'Hata');
    }
  }

  backBilgi(): void {
    this.tabToUpdate.emit({ tabName: "Kisisel" });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    $('#modalReferans').modal('hide');
  }
}
