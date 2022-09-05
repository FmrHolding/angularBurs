import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IMyDpOptions, MyDatePicker } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { OgrenciService } from 'src/app/services/ogrenci.service';
import { ParametreService } from 'src/app/services/parametre.service';
import Swal from 'sweetalert2';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
registerLocaleData(localeTr, 'tr');

@Component({
  selector: 'app-ogrenci-ekle',
  templateUrl: './ogrenci-ekle.component.html',
  styles: [
  ]
})
export class OgrenciEkleComponent implements OnInit, OnDestroy {

  onBilgiForm: FormGroup;
  firmalar = [];
  cinsiyetler = [];
  medenidurumlar = [];
  locale: any = localeTr[0];
  yuklenecekResim: string = 'assets/images/null.png';
  kayitOnay: boolean;
  submitted = false;
  file: File = null;
  kayitVar: boolean;
  private ngUnsubscribe$ = new Subject<void>();

  dogumtarihi: any = { year: new Date().getFullYear(), month: 1, day: 1 };
  basvurutarihi: any = {
    year: new Date().getFullYear(), month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd.mm.yyyy'
  };

  @ViewChild('basvuruTarihi', { static: false }) basvuruTarihi: MyDatePicker;
  @ViewChild('dogumTarihi', { static: false }) dogumTarihi: MyDatePicker;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private parametreService: ParametreService,
    private ogrenciService: OgrenciService
  ) {

    this.onBilgiForm = this.formBuilder.group({
      id: [null],
      basvurutarihi: ['', [Validators.required]],
      firmaid: ['', [Validators.required]],
      adisoyadi: ['', [Validators.required]],
      babaadi: ['', [Validators.required]],
      anneadi: ['', [Validators.required]],
      dogumyeri: ['', [Validators.required]],
      dogumtarihi: ['', [Validators.required]],
      cinsiyet: ['', [Validators.required]],
      medenidurum: ['', [Validators.required]],
      tckimlik: ['', [Validators.required, Validators.minLength(11)]],
      ceptelefonu: ['', [Validators.required, Validators.minLength(11)]],
      email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)]],
      resim: ['', [Validators.required]],
      resimboyutu: [null],
      resimuzanti: [null],
      kvkkonay: ['', [Validators.required]],
      islemtarihi: [null]
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('kvkkOnay') !== null) {
      const kvkkOnayi = localStorage.getItem('kvkkOnay');
      if (kvkkOnayi === 'true') {
        this.kayitOnay = true;
        this.kayitVar = true;
        this.onBilgiForm.get('kvkkonay').setValue(this.kayitOnay);
        this.getViewFirmalar();
        this.getViewCinsiyet();
        this.getViewMedeniDurum();
      } else {
        this.router.navigate(['/kvkk']);
      }
    } else {
      this.router.navigate(['/kvkk']);
    }
  }

  getViewFirmalar(): void {
    this.parametreService.getFirmalar().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.firmalar = data.value;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewCinsiyet(): void {
    this.parametreService.getCinsiyet().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.cinsiyetler = data.value;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewMedeniDurum(): void {
    this.parametreService.getMedeniDurum().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.medenidurumlar = data.value;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  secilenResim(fileInput: any): any {
    this.file = fileInput.target.files[0];
    this.onBilgiForm.get('resim').setValue(fileInput.target.files[0].name);
    const reader = new FileReader();
    reader.onload = () => {
      this.yuklenecekResim = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }

  onSirket(event): void {
    if (event !== undefined) {
      this.onBilgiForm.get('firmaid').setValue(event.id);
    } else {
      this.onBilgiForm.get('firmaid').setValue(null);
    }
  }

  onTcKimlikKontrol(event): void {
    //const tckimlik = this.onBilgiForm.get('tckimlik').value;
    if (event.target.value.length === 11) {
      if (!this.getTcKimlikDogrula(event.target.value)) this.toastr.error("TC Kimlk Geçerli değil", 'Hata');
      /*
      this.ogrenciService.getOgrenciGetir(event.target.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (data: any) => {
          if (data !== null) {
            this.kayitVar = true;
            this.onBilgiForm.setValue(data);
            localStorage.setItem('ogrencino', data.id);
            const dogumTarihi = new Date(data.dogumtarihi);
            const basvuruTarihi = new Date(data.basvurutarihi);
            this.dogumtarihi = { year: dogumTarihi.getFullYear(), month: dogumTarihi.getMonth() + 1, day: dogumTarihi.getDate() };
            this.basvurutarihi = { year: basvuruTarihi.getFullYear(), month: basvuruTarihi.getMonth() + 1, day: basvuruTarihi.getDate() };
            Swal.fire('Uyarı !', 'Daha önce başvuru yapmışsınız. Eğer bilgileinizde düzeltme istiyorsanız lütfen 0544 592 75 63 irtibat numarasını arayınız.', 'warning');
          } else {
            this.kayitVar = false;
          }
        },
        error: (err) => this.toastr.error(err, 'Hata')
      });
      */
    }
  }

  getTcKimlikDogrula(tckimlik: string): boolean {
    let returnValue: boolean = false;
    if (tckimlik.length == 11) {
      const bir = parseInt(tckimlik[0]);
      const iki = parseInt(tckimlik[1]);
      const uc = parseInt(tckimlik[2]);
      const dort = parseInt(tckimlik[3]);
      const bes = parseInt(tckimlik[4]);
      const alti = parseInt(tckimlik[5]);
      const yedi = parseInt(tckimlik[6]);
      const sekiz = parseInt(tckimlik[7]);
      const dokuz = parseInt(tckimlik[8]);
      const on = parseInt(tckimlik[9]);
      const onbir = parseInt(tckimlik[10]);

      const tekler = (bir + uc + bes + yedi + dokuz) * 7;
      const ciftler = (iki + dort + alti + sekiz);
      const cikart = tekler - ciftler;
      const mod10bir = cikart % 10;
      const toplam = (bir + iki + uc + dort + bes + alti + yedi + sekiz + dokuz + mod10bir);
      const mod10iki = toplam % 10;
      const soniki = mod10bir + mod10iki;
      const _soniki = on + onbir;
      if (soniki === _soniki) returnValue = true;
      else returnValue = false;
    }
    console.log(returnValue);
    return returnValue;
  }

  onBasvuruTarihi(event): void {
    if (event.formatted !== '') {
      this.onBilgiForm.get('basvurutarihi').setValue(event.date.year + '-' + event.date.month + '-' + event.date.day);
    } else {
      this.onBilgiForm.get('basvurutarihi').setValue(null);
    }
  }

  onDogumTarihi(event): void {
    if (event.formatted !== '') {
      this.onBilgiForm.get('dogumtarihi').setValue(event.date.year + '-' + event.date.month + '-' + event.date.day);
    } else {
      this.onBilgiForm.get('dogumtarihi').setValue(null);
    }
  }

  onCinsiyet(event): void {
    if (event !== undefined) {
      this.onBilgiForm.get('cinsiyet').setValue(event.id);
    } else {
      this.onBilgiForm.get('cinsiyet').setValue(null);
    }
  }

  onMedeniDurum(event): void {
    if (event !== undefined) {
      this.onBilgiForm.get('medenidurum').setValue(event.id);
    } else {
      this.onBilgiForm.get('medenidurum').setValue(null);
    }
  }

  sendOnBilgi(): void {
    Swal.fire({
      title: 'Ön Bilgi Kayıt',
      text: 'Girmiş olduğunuz kayıt edilecektir.. Onaylıyor musunuz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Vazgeç',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet'
    }).then((result) => {
      if (result.value) {
        const formData: FormData = new FormData();
        formData.append('id', this.onBilgiForm.get('id').value);
        formData.append('basvurutarihi', this.onBilgiForm.get('basvurutarihi').value);
        formData.append('firmaid', this.onBilgiForm.get('firmaid').value);
        formData.append('adisoyadi', this.onBilgiForm.get('adisoyadi').value);
        formData.append('babaadi', this.onBilgiForm.get('babaadi').value);
        formData.append('anneadi', this.onBilgiForm.get('anneadi').value);
        formData.append('dogumyeri', this.onBilgiForm.get('dogumyeri').value);
        formData.append('dogumtarihi', this.onBilgiForm.get('dogumtarihi').value);
        formData.append('cinsiyet', this.onBilgiForm.get('cinsiyet').value);
        formData.append('medenihal', this.onBilgiForm.get('medenidurum').value);
        formData.append('tckimlik', this.onBilgiForm.get('tckimlik').value);
        formData.append('ceptelefonu', this.onBilgiForm.get('ceptelefonu').value);
        formData.append('email', this.onBilgiForm.get('email').value);
        formData.append('resim', this.onBilgiForm.get('resim').value);
        formData.append('resimboyutu', this.onBilgiForm.get('resimboyutu').value);
        formData.append('resimuzanti', this.onBilgiForm.get('resimuzanti').value);
        formData.append('kvkkonay', this.onBilgiForm.get('kvkkonay').value);
        formData.append('islemtarihi', this.onBilgiForm.get('islemtarihi').value);
        formData.append('file', this.file);

        this.ogrenciService.setOgrenciKayit(formData).subscribe((data: any) => {
          if (data === 1) {
            localStorage.setItem('ogrencino', data.toString());
            this.toastr.success('Öğrenci Ön Bilgi Kayıt Başarılı.', 'Bilgilendirme');
            setTimeout(() => {
              this.router.navigate(['/detay']);
            }, 1500);
          } else {
            this.toastr.error(data, 'Hata');
          }
        },
          err => this.toastr.error(err, 'Hata')
        );

      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
