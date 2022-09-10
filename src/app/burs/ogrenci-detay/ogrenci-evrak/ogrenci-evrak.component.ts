import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { EvrakService } from 'src/app/services/evrak.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-ogrenci-evrak',
  templateUrl: './ogrenci-evrak.component.html',
  styles: [
  ]
})
export class OgrenciEvrakComponent implements OnInit {

  frmEvrak: FormGroup;
  EdittoUpdate: boolean = false;
  submitted = false;
  ColumnMode = ColumnMode;
  rows: any = [];
  evrakAdresi: any = [];
  evraktur: any = [];
  evrak: File = null;
  private ngUnsubscribe$ = new Subject<void>();

  @Input() ogrenciId: number;
  @ViewChild('ngEvrakAdi', { static: true }) ngEvrakAdi: NgSelectComponent;

  constructor(
    private evrakService: EvrakService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.frmEvrak = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      evrakadi: ['', [Validators.required]],
      evrak: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getViewEvrak(this.ogrenciId);
    this.evrakAdresi = environment.apiFile;
    this.frmEvrak.get('ogrenciid').setValue(this.ogrenciId);
    this.getViewEvrakTur();
  }

  get getControlRequest() { return this.frmEvrak.controls; }

  getViewEvrak(ogrenciid: number): void {
    this.evrakService.getEvraklar(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.value != null) {
          this.EdittoUpdate = true;
          this.frmEvrak.patchValue(data.value);
          this.rows = data.value;
        } else {
          this.EdittoUpdate = false;
          this.ngEvrakAdi.handleClearClick();
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewEvrakTur(): void {
    this.evraktur = [
      { id: 1, aciklama: 'Referans Mektubu' },
      { id: 2, aciklama: 'İkametgâh' },
      { id: 3, aciklama: 'Sabıka Kaydı' },
      { id: 4, aciklama: 'Öğrenci Belgesi ' },
      { id: 5, aciklama: 'Transkript' },
      { id: 6, aciklama: 'Nüfus Cüzdanı Fotokopisi' },
      { id: 7, aciklama: 'Hesap Cüzdanı Fotokopisi' }
    ]
  }

  onEvrakTuru(event): void {
    if (event !== undefined) {
      this.frmEvrak.get('evrakadi').setValue(event.aciklama);
    } else {
      this.frmEvrak.get('evrakadi').setValue(null);
    }
  }

  onEvrak(evrak: any): any {
    this.evrak = evrak.target.files[0];
    this.frmEvrak.get('evrak').setValue(evrak.target.files[0].name);
  }

  onYeniEvrak(): void {
    $('#modalEvrak').modal('show');
  }

  onEvrakEkle(): void {
    this.submitted = true;
    if (this.frmEvrak.invalid) {
      return;
    }
    this.rows.push(this.frmEvrak.value);
    this.rows = [...this.rows];
  }

  onDelete(index): void {
    this.rows.splice(index, 1);
    this.rows = [...this.rows];
  }

  insertBilgi(): void {
    this.submitted = true;
    if (this.frmEvrak.invalid) {
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
            this.evrakService.setEvrakKayit(element).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
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
    if (this.frmEvrak.invalid) {
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
          this.evrakService.setEvrakGuncelle(this.rows).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
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
    $('#modalEvrak').modal('hide');
  }
}
