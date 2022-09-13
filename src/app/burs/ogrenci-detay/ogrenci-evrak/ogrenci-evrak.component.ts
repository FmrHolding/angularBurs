import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { EvrakService } from 'src/app/services/evrak.service';
import { OgrenciService } from 'src/app/services/ogrenci.service';
import { StoreService } from 'src/app/services/store.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-ogrenci-evrak',
  templateUrl: './ogrenci-evrak.component.html',
  styleUrls: ['./ogrenci-evrak.component.css']
})
export class OgrenciEvrakComponent implements OnInit, OnDestroy, AfterViewInit {

  frmEvrak: FormGroup;
  EdittoUpdate: boolean = false;
  submitted = false;
  ColumnMode = ColumnMode;
  rows: any = [];
  evrakAdresi: any = [];
  evraktur: any = [];
  evrak: File = null;
  private ngUnsubscribe$ = new Subject<void>();

  @Input() data: any = [];
  @Output() tabToUpdate: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private localStore: StoreService,
    private evrakService: EvrakService,
    private ogranciService: OgrenciService,
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
    if (this.localStore.getData('kvkkOnay') === 'true') {
      if (this.data[0].islemId === 2) {
        this.getViewEvrak(this.data[0].ogrenciId);
      }
      this.evrakAdresi = environment.apiFile;
      this.frmEvrak.get('ogrenciid').setValue(this.data[0].ogrenciId);
    } else {
      this.router.navigate(['/kvkk']);
    }
  }

  get getControlRequest() { return this.frmEvrak.controls; }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getViewEvrakTur();
    }, 0);
  }

  getViewEvrak(ogrenciid: number): void {
    this.evrakService.getEvraklar(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.value != null) {
          this.EdittoUpdate = true;
          this.rows = data.value;
        } else {
          this.EdittoUpdate = false;
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewEvrakTur(): void {
    this.evraktur = [
      { id: 1, tur: "ReferansMektubu", aciklama: 'Referans Mektubu' },
      { id: 2, tur: "Ikametgah", aciklama: 'İkametgâh' },
      { id: 3, tur: "SabikaKaydi", aciklama: 'Sabıka Kaydı' },
      { id: 4, tur: "OgrenciBelgesi", aciklama: 'Öğrenci Belgesi ' },
      { id: 5, tur: "Transkript", aciklama: 'Transkript' },
      { id: 6, tur: "NufusCuzdani", aciklama: 'Nüfus Cüzdanı Fotokopisi' },
      { id: 7, tur: "HesapCuzdani", aciklama: 'Hesap Cüzdanı Fotokopisi' }
    ]
  }

  onEvrakTuru(event): void {
    if (event !== undefined) {
      this.frmEvrak.get('evrakadi').setValue(event.tur);
    } else {
      this.frmEvrak.get('evrakadi').setValue(null);
    }
  }

  onEvrak(evrak: any): any {
    let fileSize: number = evrak.target.files[0].size
    if ((fileSize / 1024) < 3000) {
      this.evrak = evrak.target.files[0];
      this.frmEvrak.get('evrak').setValue(evrak.target.files[0].name);
    } else {
      this.toastr.warning("Eklenecek Evrak boyutu 3MB az olmalı", 'UYARI');
    }
  }

  onYeniEvrak(): void {
    $('#modalEvrak').modal('show');
  }

  onEvrakEkle(): void {
    this.submitted = true;
    if (this.frmEvrak.invalid) {
      return;
    }
    this.insertBilgi();
  }

  onDelete(index: number, row: any): void {
    Swal.fire({
      title: 'Evrak Silme',
      text: 'Seçtiğiniz Evrak: ' + row.belgeadi + ' Silinicektir. Onaylıyor musunuz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Vazgeç',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet'
    }).then((result) => {
      if (result.value) {
        this.evrakService.setEvrakCikar(row.id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
          next: (data: any) => {
            if (data.statusCode === 200) {
              this.rows.splice(index, 1);
              this.rows = [...this.rows];
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

  insertBilgi(): void {
    this.submitted = true;
    if (this.frmEvrak.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Evrak Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          const formDataEvrak: FormData = new FormData();
          formDataEvrak.append('ogrenciid', this.frmEvrak.get('ogrenciid').value);
          formDataEvrak.append('evrakadi', this.frmEvrak.get('evrakadi').value);
          formDataEvrak.append('evrak', this.evrak);
          this.evrakService.setEvrakKayit(formDataEvrak).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 200) {
                this.rows.push(data.value);
                this.rows = [...this.rows];
                this.toastr.success("Kayıt başarıyla eklendi", 'Bilgilendirme');
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

  endToBurs(): void {
    Swal.fire({
      title: 'Başvuru Tamamlam',
      text: 'Başvurunuz Kaydedilip Kapatılacaktır. Onaylıyor musunuz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Vazgeç',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet'
    }).then((result) => {
      if (result.value) {
        this.ogranciService.setOgrenciEndtoBurs(this.data[0].ogrenciId).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
          next: (data: any) => {
            if (data.statusCode === 200) {
              this.toastr.success(data.message, 'Bilgilendirme');
              setTimeout(() => {
                this.router.navigate(['/kvkk']);
              }, 1000);
            } else {
              this.toastr.error(data.message, 'Hata');
            }
          },
          error: (err) => this.toastr.error(err, 'Hata')
        });
      }
    });
  }

  backBilgi(): void {
    this.tabToUpdate.emit({ tabName: "Referans" });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    $('#modalEvrak').modal('hide');
  }
}

