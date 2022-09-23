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
  submitted = false;
  ColumnMode = ColumnMode;
  rows: any = [];
  evrakAdresi: any = [];
  evraktur: any = [];
  evrak: File = null;
  evraktam: boolean = false;
  ReferansMektubu: boolean = false;
  Ikametgah: boolean = false;
  SabikaKaydi: boolean = false;
  OgrenciBelgesi: boolean = false;
  Transkript: boolean = false;
  NufusCuzdani: boolean = false;
  HesapCuzdani: boolean = false;
  private ngUnsubscribe$ = new Subject<void>();

  @Input() data: any = [];
  @Output() tabToUpdate: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private evrakService: EvrakService,
    private ogranciService: OgrenciService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private localStore: StoreService
  ) {

  }

  ngOnInit(): void {
    if (this.data[0].islemId === 2) {
      this.getViewEvrak(this.data[0].ogrenciId);
    }
    this.evrakAdresi = environment.apiFile;
    this.setEvrakForm();
    this.onEvrakKontrol();
  }

  get getControlRequest() { return this.frmEvrak.controls; }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getViewEvrakTur();
    }, 0);
  }

  setEvrakForm(): void {
    this.frmEvrak = this.fb.group({
      id: [0],
      ogrenciid: [this.data[0].ogrenciId, [Validators.required]],
      evrakadi: ['', [Validators.required]],
      evrak: ['', [Validators.required]]
    });
  }

  getViewEvrak(ogrenciid: number): void {
    this.evrakService.getEvraklar(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.value != null) {
          this.rows = data.value;
          this.onEvrakKontrol();
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
      if (this.rows.length > 0) {
        this.rows.forEach(element => {
          if (element.belgeadi === event.tur) {
            this.frmEvrak.get('evrakadi').setValue(null);
            this.toastr.warning("Eklemek istediğiniz belge var", 'UYARI');
            return true;
          } else {
            this.frmEvrak.get('evrakadi').setValue(event.tur);
          }
        });
      } else {
        this.frmEvrak.get('evrakadi').setValue(event.tur);
      }
    } else {
      this.frmEvrak.get('evrakadi').setValue(null);
    }
  }

  onEvrakKontrol(): void {
    this.ReferansMektubu = false;
    this.Ikametgah = false;
    this.SabikaKaydi = false;
    this.OgrenciBelgesi = false;
    this.Transkript = false;
    this.NufusCuzdani = false;
    this.HesapCuzdani = false;

    let evraksay: number = 0;
    this.rows.forEach(element => {
      if (element.belgeadi === this.evraktur[0].tur) {
        this.ReferansMektubu = true;
      } else if (element.belgeadi === this.evraktur[1].tur) {
        this.Ikametgah = true;
        evraksay = evraksay + 1;
      } else if (element.belgeadi === this.evraktur[2].tur) {
        this.SabikaKaydi = true;
        evraksay = evraksay + 1;
      } else if (element.belgeadi === this.evraktur[3].tur) {
        this.OgrenciBelgesi = true;
        evraksay = evraksay + 1;
      } else if (element.belgeadi === this.evraktur[4].tur) {
        this.Transkript = true;
        if (this.localStore.getData('transkrip') === 'true') {
          evraksay = evraksay + 1;
        }
      } else if (element.belgeadi === this.evraktur[5].tur) {
        this.NufusCuzdani = true;
        evraksay = evraksay + 1;
      } else if (element.belgeadi === this.evraktur[6].tur) {
        this.HesapCuzdani = true;
        evraksay = evraksay + 1;
      }
    });
    if (this.localStore.getData('transkrip') === 'true') {
      if (evraksay === 6) {
        this.evraktam = true;
      } else {
        this.evraktam = false;
      }
    } else if (this.localStore.getData('transkrip') === 'false' || this.localStore.getData('universite') === 'true') {
      if (evraksay === 5) {
        this.evraktam = true;
      } else {
        this.evraktam = false;
      }
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
    this.setEvrakForm();
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
      html: row.belgeadi + ' belgesi silinecektir. <br> Onaylıyor musunuz?',
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
              this.toastr.success(data.message, 'Bilgilendirme');
              this.onEvrakKontrol();
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
              if (data.statusCode === 201) {
                this.evrakService.getEvrak(data.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
                  next: (data: any) => {
                    if (data.statusCode === 200 && data.value != null) {
                      this.rows.push(data.value);
                      this.rows = [...this.rows];
                      this.toastr.success(data.message, 'Bilgilendirme', { timeOut: 750 });
                      this.onEvrakKontrol();
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

  endToBurs(): void {
    this.onEvrakKontrol();
    if (!this.evraktam) {
      this.toastr.warning("Eklenmesi gereken evraklarda eksiklik var.", 'UYARI');
    } else {
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
          this.ogranciService.setOgrenciEndtoBurs(this.data[0].ogrenciId, 1, 1).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
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

