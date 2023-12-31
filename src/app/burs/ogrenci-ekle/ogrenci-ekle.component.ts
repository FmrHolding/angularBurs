import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IMyDpOptions } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { OgrenciService } from 'src/app/services/ogrenci.service';
import { ParametreService } from 'src/app/services/parametre.service';
import Swal from 'sweetalert2';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { environment } from 'src/environments/environment';
import { TckontrolService } from 'src/app/common/tckontrol.service';
import { InputkontrolService } from 'src/app/common/inputkontrol.service';
import { FirmaService } from 'src/app/services/firma.service';
registerLocaleData(localeTr, 'tr');
declare var $: any;

@Component({
  selector: 'app-ogrenci-ekle',
  templateUrl: './ogrenci-ekle.component.html'

})
export class OgrenciEkleComponent implements OnInit, OnDestroy, AfterViewInit {

  frmOnBilgi: FormGroup;
  EdittoUpdate: boolean = false;
  resimyolu: string;
  submitted = false;
  firmalar = [];
  cinsiyetler = [];
  medenidurumlar = [];
  locale: any = localeTr[0];
  yuklenecekResim: string = 'assets/images/null.png';
  kayitOnay: boolean;
  file: File = null;
  kayitVar: boolean;
  private ngUnsubscribe$ = new Subject<void>();

  dogumtarihi: any = { year: new Date().getFullYear(), month: 1, day: 1 };

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd.mm.yyyy'
  };

  @ViewChild('ngFirma', { static: true }) ngFirma: NgSelectComponent;
  @ViewChild('ngCinsiyet', { static: true }) ngCinsiyet: NgSelectComponent;
  @ViewChild('ngMedeniHal', { static: true }) ngMedeniHal: NgSelectComponent;
  @ViewChild('adSoyadInput', { static: true }) adSoyadInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private parametreService: ParametreService,
    private ogrenciService: OgrenciService,
    private firmaService: FirmaService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private tcKontrol: TckontrolService,
    private inputKontrol: InputkontrolService
  ) {

    this.frmOnBilgi = this.formBuilder.group({
      id: [0],
      firmaid: ['', [Validators.required]],
      adisoyadi: ['', [Validators.required]],
      babaadi: ['', [Validators.required]],
      anneadi: ['', [Validators.required]],
      dogumyeri: ['', [Validators.required]],
      dogumtarihi: ['', [Validators.required]],
      cinsiyetid: [0, [Validators.required]],
      medenihalid: [0, [Validators.required]],
      tckimlik: ['', [Validators.required, Validators.minLength(11)]],
      ceptelefonu: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)]],
      resimyolu: ['', [Validators.required]],
      resimuzanti: [''],
      resimboyutu: [''],
      kvkkonay: [true],
      
    });
  }

  ngOnInit(): void {    
    $('#modalDuyuru').modal('show');
    if (localStorage.getItem('kvkkOnay') === 'true') {
      this.resimyolu = environment.apiFile;
      this.frmOnBilgi.get('kvkkonay').setValue(true);
    } else {
      this.router.navigate(['/kvkk']);
      this.frmOnBilgi.get('kvkkonay').setValue(false)
    }
  }

  get getControlRequest() { return this.frmOnBilgi.controls; }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getViewCinsiyet();
      this.getViewMedeniDurum();
      this.getViewFirmalar();
      this.ngFirma.handleClearClick();
      this.ngCinsiyet.handleClearClick();
      this.ngMedeniHal.handleClearClick();
    }, 0);
  }
  
  onModalKapat(): void {
    $('#modalDuyuru').modal('hide');
  }

  getViewOgrenci(tckimlik: string): void {
    this.ogrenciService.getOgrenci(tckimlik).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.statusCode === 200 && data.value != null && data.value.kapandi === true) {
          Swal.fire({
            icon: 'error',
            title: 'UYARI',
            text: 'Daha önce başuru yaptınız. Eğer başvurunuzda değişiklik yapmak istiyorsanız lütfen' +
              ' firmamızı arayıp başvurunuzun değişik yapmaya açılmasını isteyiniz.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Tamam'
          }).then((result) => {
            if (result.value) {
              this.router.navigate(['/kvkk']);
            }
          });
        }
        else if (data.statusCode === 200 && data.value != null && data.value.kapandi == false) {
          localStorage.setItem('ogrenciId', data.value.id.toString());
          localStorage.setItem('IslemId', '2');
          this.EdittoUpdate = true;
          this.yuklenecekResim = this.resimyolu + data.value.resimyolu;
          const dogumTarihi = new Date(data.value.dogumtarihi);
          var time = new Date().getTime() - new Date(dogumTarihi).getTime();
          var year =Math.floor(time / (365 *1000 * 3600 * 24)) ;      
          localStorage.setItem('yas', year.toString());
          this.dogumtarihi = { year: dogumTarihi.getFullYear(), month: dogumTarihi.getMonth() + 1, day: dogumTarihi.getDate() };
          this.frmOnBilgi.patchValue(data.value);
          this.frmOnBilgi.get('kvkkonay').setValue(true);
          this.frmOnBilgi.get('resimyolu').clearValidators();
        }
        this.adSoyadInput.nativeElement.focus();
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewFirmalar(): void {
    this.parametreService.getFirma().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.statusCode == 200) {
          let firma: any = [];
          data.value.forEach(element => {
            if (element.id < 14) {
              firma.push({
                id: element.id,
                unvani: element.unvani
              });
            }
          });
          this.firmalar = firma;
        } else {
          this.toastr.error(data.message, 'Hata')
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewCinsiyet(): void {
    this.cinsiyetler = [
      { id: 1, cinsiyeti: 'Erkek' },
      { id: 2, cinsiyeti: 'Kadın' }
    ];
  }

  getViewMedeniDurum(): void {
    this.medenidurumlar = [
      { id: 1, durumu: 'Bekar' },
      { id: 2, durumu: 'Evli' },
      { id: 3, durumu: 'Boşanmış' }
    ];
  }

  onSirket(event): void {
    if (event !== undefined) {
      this.frmOnBilgi.get('firmaid').setValue(event.id);
    } else {
      this.frmOnBilgi.get('firmaid').setValue(null);
    }
  }

  secilenResim(fileInput: any): any {
    this.yuklenecekResim = 'assets/images/null.png';
    let fileSize: number = fileInput.target.files[0].size
    if ((fileSize / 1024) < 3000) {
      this.file = fileInput.target.files[0];
      this.frmOnBilgi.get('resimyolu').setValue(fileInput.target.files[0].name);
      const reader = new FileReader();
      reader.onload = () => {
        this.yuklenecekResim = reader.result as string;
      };
      reader.readAsDataURL(this.file);
    } else {
      this.toastr.warning("Resim boyutu en fazla 3MB olmalı", 'UYARI');
    }
  }

  onTcKontrol(event): void {
    if (event.target.value.length === 11) {
      if (!this.tcKontrol.tckKontrol(event.target.value)) {
        this.toastr.error("TC Kimlik doğrulanmadı", 'Hata');
      } else {
        this.getViewOgrenci(event.target.value)
      }
    }
  }

  onInputKontrol(event): boolean {
    return this.inputKontrol.inputOnlyChareacter(event);
  }

  onDogumTarihi(event): void {
    if (event.formatted !== '') {
      const date = new Date(event.date.year, event.date.month - 1, event.date.day);
      var time = new Date().getTime() - new Date(date).getTime();
      var year =Math.floor(time / (365 *1000 * 3600 * 24)) ;      
      localStorage.setItem('yas', year.toString());
      this.frmOnBilgi.get('dogumtarihi').setValue(date.toLocaleDateString());
    } else {
      this.frmOnBilgi.get('dogumtarihi').setValue(null);
    }
  }

  onCinsiyet(event): void {
    if (event !== undefined) {
      this.frmOnBilgi.get('cinsiyetid').setValue(event.id);
    } else {
      this.frmOnBilgi.get('cinsiyetid').setValue(null);
    }
  }

  onMedeniDurum(event): void {
    if (event !== undefined) {
      this.frmOnBilgi.get('medenihalid').setValue(event.id);
    } else {
      this.frmOnBilgi.get('medenihalid').setValue(null);
    }
  }

  insertBilgi(): void {
    this.submitted = true;
    if (this.frmOnBilgi.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Ön Bilgi Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          const formData: FormData = new FormData();
          formData.append('id', '0');
          formData.append('firmaid', this.frmOnBilgi.get('firmaid').value);
          formData.append('adisoyadi', this.frmOnBilgi.get('adisoyadi').value);
          formData.append('babaadi', this.frmOnBilgi.get('babaadi').value);
          formData.append('anneadi', this.frmOnBilgi.get('anneadi').value);
          formData.append('dogumyeri', this.frmOnBilgi.get('dogumyeri').value);
          formData.append('dogumtarihi', this.frmOnBilgi.get('dogumtarihi').value);
          formData.append('cinsiyetid', this.frmOnBilgi.get('cinsiyetid').value);
          formData.append('medenihalid', this.frmOnBilgi.get('medenihalid').value);
          formData.append('tckimlik', this.frmOnBilgi.get('tckimlik').value);
          formData.append('ceptelefonu', this.frmOnBilgi.get('ceptelefonu').value);
          formData.append('email', this.frmOnBilgi.get('email').value);
          formData.append('ogrenciresim', this.file);
          formData.append('kvkkonay', this.frmOnBilgi.get('kvkkonay').value);
          this.ogrenciService.setOgrenciKayit(formData).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 201) {
                this.toastr.success(data.message, 'Bilgilendirme');
                localStorage.setItem('ogrenciId', data.value.id.toString());
                localStorage.setItem('IslemId', "1");
                setTimeout(() => {
                  this.router.navigate(['burs/detay/' + data.value.id + '/' + data.value.tckimlik +'/2023']);
                }, 1000);
              } else if (data.statusCode === 200) {
                this.toastr.success(data.message, 'Bilgilendirme');
                localStorage.setItem('ogrenciId', data.value.id.toString());
                localStorage.setItem('IslemId', "1");
                setTimeout(() => {
                  this.router.navigate(['burs/detay']);
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

  updateBilgi(): void {
    this.submitted = true;
    if (this.frmOnBilgi.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Ön Bilgi Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          const formData: FormData = new FormData();
          formData.append('id', this.frmOnBilgi.get('id').value);
          formData.append('firmaid', this.frmOnBilgi.get('firmaid').value);
          formData.append('adisoyadi', this.frmOnBilgi.get('adisoyadi').value);
          formData.append('babaadi', this.frmOnBilgi.get('babaadi').value);
          formData.append('anneadi', this.frmOnBilgi.get('anneadi').value);
          formData.append('dogumyeri', this.frmOnBilgi.get('dogumyeri').value);
          formData.append('dogumtarihi', this.frmOnBilgi.get('dogumtarihi').value);
          formData.append('cinsiyetid', this.frmOnBilgi.get('cinsiyetid').value);
          formData.append('medenihalid', this.frmOnBilgi.get('medenihalid').value);
          formData.append('tckimlik', this.frmOnBilgi.get('tckimlik').value);
          formData.append('ceptelefonu', this.frmOnBilgi.get('ceptelefonu').value);
          formData.append('email', this.frmOnBilgi.get('email').value);
          formData.append('ogrenciresim', this.file);
          formData.append('resimyolu', this.frmOnBilgi.get('resimyolu').value);
          formData.append('resimuzanti', this.frmOnBilgi.get('resimuzanti').value);
          formData.append('resimboyutu', this.frmOnBilgi.get('resimboyutu').value);
          formData.append('kvkkonay', this.frmOnBilgi.get('kvkkonay').value);
          this.ogrenciService.setOgrenciUpdate(formData).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 201) {
                this.toastr.success(data.message, 'Bilgilendirme');
                localStorage.setItem('ogrenciId', this.frmOnBilgi.get('id').value.toString());
                localStorage.setItem('IslemId', "2");
                
                setTimeout(() => {
                  this.router.navigate(['burs/detay/' + this.frmOnBilgi.get('id').value + '/' + this.frmOnBilgi.get('tckimlik').value +'/2023']);
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

  firmaKayit(ogrenciid: number, firmaid: number, islem: number): void {
    const firma = [];
    firma.push({
      id: 0,
      ogrenciid: ogrenciid,
      firmaid: firmaid
    });
    this.firmaService.setFirmaKayit(firma[0]).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.statusCode === 200) {
          this.toastr.success(data.message, 'Bilgilendirme');
          localStorage.setItem('ogrenciId', ogrenciid.toString());
          localStorage.setItem('IslemId', islem.toString());
          setTimeout(() => {
            this.router.navigate(['burs/detay']);
          }, 1500);
        } else {
          this.toastr.error(data.message, 'Hata');
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
