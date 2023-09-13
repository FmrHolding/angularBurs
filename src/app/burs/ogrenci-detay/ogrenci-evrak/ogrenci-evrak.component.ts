import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Subject, race, takeUntil } from 'rxjs';
import { EvrakService } from 'src/app/services/evrak.service';
import { OgrenciService } from 'src/app/services/ogrenci.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-ogrenci-evrak',
  templateUrl: './ogrenci-evrak.component.html',
  styleUrls: ['./ogrenci-evrak.component.css']
})
export class OgrenciEvrakComponent implements OnInit, OnDestroy {

  frmEvrak: FormGroup;
  submitted = false;
  ColumnMode = ColumnMode;
  rows: any = [];
  evrakAdresi: any = [];
  evraktur: any = [];
  evrak: File = null;
  Ikametgah: boolean = false;
  SabikaKaydi: boolean = false;
  OgrenciBelgesi: boolean = false;
  Transkript: boolean = false;
  NufusCuzdani: boolean = false;
  lise: boolean = false;
  private ngUnsubscribe$ = new Subject<void>();

  @Input() data: any = [];
  @Output() tabToUpdate: EventEmitter<any> = new EventEmitter();
  
  @ViewChild('evrakTuru', { static: true }) evrakTuru: NgSelectComponent;

  constructor(
    private router: Router,
    private evrakService: EvrakService,
    private ogranciService: OgrenciService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.data[0].islemId === 2) {
      this.getViewEvrak(this.data[0].ogrenciId);
    }
    this.evrakAdresi = environment.apiFile;
    this.getViewEvrakTur();
    this.setEvrakForm();
  }

  get getControlRequest() { return this.frmEvrak.controls; }

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
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewEvrakTur(): void {
    this.evraktur = [
      { id: 1, tur: "Ikametgah", aciklama: 'İkametgâh' },
      { id: 2, tur: "SabikaKaydi", aciklama: 'Sabıka Kaydı' },
      { id: 3, tur: "OgrenciBelgesi", aciklama: 'Öğrenci Belgesi ' },
      { id: 4, tur: "Transkript", aciklama: 'Transkript' },
      { id: 5, tur: "NufusCuzdani", aciklama: 'Nüfus Cüzdanı Fotokopisi' }
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

  onEvrakKontrol(): boolean {
    let evrakSay: number = 0;
    this.rows.forEach(element => {
      if (element.belgeadi === 'Ikametgah') {
        evrakSay = evrakSay + 1;
      } else if (element.belgeadi === 'SabikaKaydi' && parseInt(localStorage.getItem('yas')) > 17) {
        evrakSay = evrakSay + 1;
      } else if (element.belgeadi === 'OgrenciBelgesi') {
        evrakSay = evrakSay + 1;
      } else if (element.belgeadi === 'Transkript' && localStorage.getItem('transkrip') === 'true') {
        evrakSay = evrakSay + 1;
      } else if (element.belgeadi === 'NufusCuzdani') {
        evrakSay = evrakSay + 1;
      }
    });
    if (evrakSay >= 3 && parseInt(localStorage.getItem('yas')) < 17) {
      return true;
    } else if (evrakSay >= 3 && localStorage.getItem('transkrip') === 'false') {
      return true;
    } else {
      return false;
    }
  }

  onEvrak(evrak: any): any {
    let fileSize: number = evrak.target.files[0].size
    if ((fileSize / 1024) < 3000) {
      this.evrak = evrak.target.files[0];
      this.frmEvrak.get('evrak').setValue(evrak.target.files[0].name);
    } else {
      this.toastr.error("Eklenecek Evrak boyutu en fazla 3MB olmalı", 'UYARI');
    }
  }

  onYeniEvrak(): void {
    this.setEvrakForm();
    this.frmEvrak.get('evrak').clearValidators();
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
          formDataEvrak.append('tckimlik', this.data[0].tckimlik);
          this.evrakService.setEvrakKayit(formDataEvrak).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 201) {
                this.rows.push(data.value);
                this.rows = [...this.rows];
                this.toastr.success(data.message, 'Bilgilendirme', { timeOut: 750 });
                this.frmEvrak.get('evrak').clearValidators();
                this.evrakTuru.handleClearClick();
                $('#modalEvrak').modal('hide');
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
    if (!this.onEvrakKontrol()) {
      this.toastr.error("Eksik belge var. Lütfen gerekli tüm belgeleri yükleyiniz.", 'Hata')
    } else {
      Swal.fire({
        title: 'Başvuru Tamamlama',
        html: 'Başvurunuz Kaydedilip Kapatılacaktır.Bilgilerin eksiksiz olduğunu beyan ettiniz.<br> Onaylıyor musunuz?',
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
                this.toastr.error(data.errors[0], 'Hata');
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

