import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IMyDpOptions } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { OgrenciService } from 'src/app/services/ogrenci.service';
import { ParametreService } from 'src/app/services/parametre.service';
import Swal from 'sweetalert2';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
registerLocaleData(localeTr, 'tr');

@Component({
  selector: 'app-ogrenci-detay',
  templateUrl: './ogrenci-detay.component.html'
})
export class OgrenciDetayComponent implements OnInit, OnDestroy {

  public onOkulForm: FormGroup;
  public onBankaForm: FormGroup;
  public onSosyoEkonomiForm: FormGroup;
  public onKardesForm: FormGroup;
  public onKisiselForm: FormGroup;
  public onReferansForm: FormGroup;
  public onEvrakForm: FormGroup;
  public locale = localeTr[0];
  public submitted = false;
  public universitler: any[];
  public universitesinif: any[];
  public universitetipleri: any[];
  public universiteburslar: any[];
  public liseler: any[];
  public lisetipleri: any[];
  public bankalar: any[];
  public aileyasam: any[];
  public ogrenimler: any[];
  public oturduguev: any[];
  public aileberaber: any[];
  public ailedenberaber: any[];
  public ikametedilecekyer: any[];
  public sigaradurumu: any[];
  public ailebirlikteligi: any[];
  public kardessayilari: any[];
  public okuyankardesler: any[];
  public ogrenciNo: number;
  public kardesSayisi: number;
  public medenidurumlar: any[];
  public isdurumlari: any[];
  public babaolu: boolean;
  public anneolu: boolean;
  private ngUnsubscribe$ = new Subject<void>();


  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'dd.mm.yyyy'
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private parametreService: ParametreService,
    private ogrenciService: OgrenciService,
    private toastr: ToastrService
  ) {
    this.onOkulForm = this.fb.group({
      id: [0, [Validators.required]],
      ogrenciid: [0, [Validators.required]],
      universiteid: [0, [Validators.required]],
      fakulte: [null, [Validators.required]],
      bolum: [null, [Validators.required]],
      sinif: [null, [Validators.required]],
      universitetipi: [null, [Validators.required]],
      ucreti: [null, [Validators.required]],
      bursluluk: [null, [Validators.required]],
      liseadi: [null, [Validators.required]],
      lisetipi: [null, [Validators.required]],
      liseturu: [null, [Validators.required]]
    });

    this.onBankaForm = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      banka: [null, [Validators.required]],
      subekodu: [null, [Validators.required]],
      hesapno: [null, [Validators.required]],
      ibanno: [null, [Validators.required]],
      ibansahibi: [null, [Validators.required]],
      ibansahibitc: [null, [Validators.required]]
    });

    this.onSosyoEkonomiForm = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      annebababirliktelik: [null, [Validators.required]],
      babaogrenim: [null],
      babameslek: [null],
      babagelir: [0],
      babaisadresi: [null],
      babatelefon: [null],
      anneogrenim: [null],
      annemeslek: [null],
      annegelir: [0],
      anneisadresi: [null],
      annetelefon: [null],
      ailedigergelirtoplam: [0, [Validators.required]],
      ailedigergeliraciklama: ['Yok', [Validators.required]],
      aileikametadresi: [null, [Validators.required]],
      ailemulkdurum: [null, [Validators.required]],
      sabittelefon: [0, [Validators.required]],
      ailekira: [0, [Validators.required]],
      ailesaglik: [null, [Validators.required]]
    });

    this.onKardesForm = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      kardessayisi: [null, [Validators.required]],
      kardes1adisoyadi: [null],
      kardes1yas: [null],
      kardes1okul: [null],
      kardes1burs: [null],
      kardes2adisoyadi: [null],
      kardes2yas: [null],
      kardes2okul: [null],
      kardes2burs: [null],
      kardes3adisoyadi: [null],
      kardes3yas: [null],
      kardes3okul: [null],
      kardes3burs: [null],
      kardes4adisoyadi: [null],
      kardes4yas: [null],
      kardes4okul: [null],
      kardes4burs: [null],
      kardes5adisoyadi: [null],
      kardes5yas: [null],
      kardes5okul: [null],
      kardes5burs: [null]
    });

    this.onKisiselForm = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      aileileberaber: [null, [Validators.required]],
      ailedenayri: [null, [Validators.required]],
      ikametyeri: [null, [Validators.required]],
      yurtadi: [null, [Validators.required]],
      evyurtkirasi: [null, [Validators.required]],
      evyurtdiger: ['Yok', [Validators.required]],
      sagliksorunu: ['Yok', [Validators.required]],
      sigara: [null, [Validators.required]],
      ogrenimdekiadres: [null, [Validators.required]],
      dernek: ['Yok', [Validators.required]],
      bursveren: ['Yok', [Validators.required]],
      bursmiktari: [0, [Validators.required]],
      krediveren: ['Yok', [Validators.required]],
      kredimiktari: [0, [Validators.required]],
      fikirdusunce: [null]
    });

    this.onReferansForm = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      referans1adisoyadi: [null],
      referans1yakinlik: [null],
      referans1gorevi: [null],
      referans1telefon: [null],
      referans2adisoyadi: [null],
      referans2yakinlik: [null],
      referans2gorevi: [null],
      referans2telefon: [null],
      referans3adisoyadi: [null],
      referans3yakinlik: [null],
      referans3gorevi: [null],
      referans3telefon: [null],
    });

    this.onEvrakForm = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      referansmektubu: [null],
      ikametgah: [null, [Validators.required]],
      sabikakaydi: [null, [Validators.required]],
      ogrencibelgesi: [null, [Validators.required]],
      transkript: [null, [Validators.required]],
      nufuscuzdani: [null, [Validators.required]],
      hesapcuzdani: [null, [Validators.required]]
    });

  }

  ngOnInit(): void {
    const ogrenciNo = parseInt(this.route.snapshot.paramMap.get('id'));
    this.ogrenciNo = parseInt(localStorage.getItem('ogrencino'));
    this.onOkulForm.get('ogrenciid').setValue(this.ogrenciNo);
    this.onBankaForm.get('ogrenciid').setValue(this.ogrenciNo);
    this.onSosyoEkonomiForm.get('ogrenciid').setValue(this.ogrenciNo);
    this.onKardesForm.get('ogrenciid').setValue(this.ogrenciNo);
    this.onKisiselForm.get('ogrenciid').setValue(this.ogrenciNo);
    this.onReferansForm.get('ogrenciid').setValue(this.ogrenciNo);
    this.onEvrakForm.get('ogrenciid').setValue(this.ogrenciNo);
    /*
    this.getUniversiteler();
    this.getUniversiteSinif();
    this.getUniversiteBurslar();
    this.getUniversiteTipleri();
    this.getLiseler();
    this.getLiseTipleri();
    this.getBankalar();
    this.getOgrenimler();
    this.getAileBeraber();
    this.getAileBirliktelik();
    this.getAiledenAyri();
    this.getIkametEdilecekYer();
    this.getIsDurum();
    this.getKardesSayilari();
    this.getMedeniDurum();
    this.getOturduguEv();
    this.getSigaraDurumu();
    */
  }

  getUniversiteler(): void {
    this.parametreService.getUniversiteler().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.universitler = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getUniversiteSinif(): void {
    this.parametreService.getUniversiteSinif().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.universitesinif = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getUniversiteBurslar(): void {
    this.parametreService.getUniversiteBurslar().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.universiteburslar = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getUniversiteTipleri(): void {
    this.parametreService.getUniversiteTipleri().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.universitetipleri = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getLiseler(): void {
    this.parametreService.getLiseler().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.liseler = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getLiseTipleri(): void {
    this.parametreService.getLiseTipleri().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.lisetipleri = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getBankalar(): void {
    this.parametreService.getBankalar().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.bankalar = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getOgrenimler(): void {
    this.parametreService.getOgrenimler().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.ogrenimler = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getAileBeraber(): void {
    this.parametreService.getAileBeraber().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.aileberaber = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getAileBirliktelik(): void {
    this.parametreService.getAileBirliktelik().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.ailebirlikteligi = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getAiledenAyri(): void {
    this.parametreService.getAiledenAyri().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.ailedenberaber = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getIkametEdilecekYer(): void {
    this.parametreService.getIkametEdilecekYer().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.ikametedilecekyer = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getIsDurum(): void {
    this.parametreService.getIsDurum().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.isdurumlari = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getKardesSayilari(): void {
    this.parametreService.getKardesSayilari().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.kardessayilari = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getMedeniDurum(): void {
    this.parametreService.getMedeniDurum().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.medenidurumlar = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getOturduguEv(): void {
    this.parametreService.getOturduguEv().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.oturduguev = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getSigaraDurumu(): void {
    this.parametreService.getSigaraDurumu().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.sigaradurumu = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  onUniversite(event): void {
    if (event !== undefined) {
      this.onOkulForm.get('universiteid').setValue(event.id);
    } else {
      this.onOkulForm.get('universiteid').setValue(null);
    }
  }

  onUniversiteSinif(event): void {
    if (event !== undefined) {
      this.onOkulForm.get('sinif').setValue(event.id);
    } else {
      this.onOkulForm.get('sinif').setValue(null);
    }
  }

  onUniversiteTipi(event): void {
    if (event !== undefined) {
      this.onOkulForm.get('universitetipi').setValue(event.id);
    } else {
      this.onOkulForm.get('universitetipi').setValue(null);
    }
  }

  onUniversiteBursTuru(event): void {
    if (event !== undefined) {
      this.onOkulForm.get('bursluluk').setValue(event.id);
    } else {
      this.onOkulForm.get('bursluluk').setValue(null);
    }
  }

  onLiseTipi(event): void {
    if (event !== undefined) {
      this.onOkulForm.get('lisetipi').setValue(event.id);
    } else {
      this.onOkulForm.get('lisetipi').setValue(null);
    }
  }

  onLiseTuru(event): void {
    if (event !== undefined) {
      this.onOkulForm.get('liseturu').setValue(event.id);
    } else {
      this.onOkulForm.get('liseturu').setValue(null);
    }
  }

  onBanka(event): void {
    if (event !== undefined) {
      this.onBankaForm.get('banka').setValue(event.id);
    } else {
      this.onBankaForm.get('banka').setValue(null);
    }
  }

  onAnneBabaBirliktelik(event): void {
    if (event !== undefined) {
      if (event.id === 3) {
        this.anneolu = true;
        this.babaolu = false;
      } else if (event.id === 4) {
        this.anneolu = false;
        this.babaolu = true;
      } else if (event.id === 5) {
        this.anneolu = true;
        this.babaolu = true;
      } else {
        this.anneolu = false;
        this.babaolu = false;
      }
      this.onSosyoEkonomiForm.get('annebababirliktelik').setValue(event.id);
    } else {
      this.onSosyoEkonomiForm.get('annebababirliktelik').setValue(null);
      this.anneolu = false;
      this.babaolu = false;
    }
  }

  onBabaOgrenim(event): void {
    if (event !== undefined) {
      this.onSosyoEkonomiForm.get('babaogrenim').setValue(event.id);
    } else {
      this.onSosyoEkonomiForm.get('babaogrenim').setValue(null);
    }
  }

  onAnneOgrenim(event): void {
    if (event !== undefined) {
      this.onSosyoEkonomiForm.get('anneogrenim').setValue(event.id);
    } else {
      this.onSosyoEkonomiForm.get('anneogrenim').setValue(null);
    }
  }

  onAileMulkDurum(event): void {
    if (event !== undefined) {
      this.onSosyoEkonomiForm.get('ailemulkdurum').setValue(event.id);
    } else {
      this.onSosyoEkonomiForm.get('ailemulkdurum').setValue(null);
    }
  }

  onKardesSayisi(event): void {
    if (event !== undefined) {
      this.kardesSayisi = event.id;
      this.onKardesForm.get('kardessayisi').setValue(event.id);
    } else {
      this.onKardesForm.get('kardessayisi').setValue(null);
      this.kardesSayisi = 0;
    }
  }

  onAileileBeraber(event): void {
    if (event !== undefined) {
      if (event.id === 1) {
        this.ailedenberaber[0].disabled = true;
      }
      this.onKisiselForm.get('aileberaber').setValue(event.id);
    } else {
      this.onKisiselForm.get('aileberaber').setValue(null);
    }
  }

  onAiledenAyri(event): void {
    if (event !== undefined) {
      this.onKisiselForm.get('ailedenayri').setValue(event.id);
    } else {
      this.onKisiselForm.get('ailedenayri').setValue(null);
    }
  }

  onIkametYeri(event): void {
    if (event !== undefined) {
      this.onKisiselForm.get('ikametyeri').setValue(event.id);
    } else {
      this.onKisiselForm.get('ikametyeri').setValue(null);
    }
  }

  onSigara(event): void {
    if (event !== undefined) {
      this.onKisiselForm.get('sigara').setValue(event.id);
    } else {
      this.onKisiselForm.get('sigara').setValue(null);
    }
  }

  referansMektubu(fileInput: any): any {
    console.log(fileInput.target.files[0]);
  }

  ikametgah(fileInput: any): any {
    console.log(fileInput.target.files[0]);
  }

  sabikaKaydi(fileInput: any): any {
    console.log(fileInput.target.files[0]);
  }

  ogrenciBelgesi(fileInput: any): any {
    console.log(fileInput.target.files[0]);
  }

  transkrip(fileInput: any): any {
    console.log(fileInput.target.files[0]);
  }

  nufusCuzdani(fileInput: any): any {
    console.log(fileInput.target.files[0]);
  }

  hesapCuzdani(fileInput: any): any {
    console.log(fileInput.target.files[0]);
  }

  sendDetayBilgi(): void {

  }

  formuGonder(): void {
    this.submitted = true;

    if (this.onOkulForm.invalid) {
      switch (this.onOkulForm.invalid) {
        case this.onOkulForm.get('universite').invalid:
          Swal.fire('Üniversite bilgisi girmediniz.');
          break;
        case this.onOkulForm.get('fakulte').invalid:
          Swal.fire('Fakülte bilgisini girmediniz.');
          break;
        case this.onOkulForm.get('bolum').invalid:
          Swal.fire('Bölüm bilgisini girmediniz.');
          break;
        case this.onOkulForm.get('sinif').invalid:
          Swal.fire('Sınıf girmediniz.');
          break;
        case this.onOkulForm.get('universitetipi').invalid:
          Swal.fire('Üniversite tipi girmediniz.');
          break;
        case this.onOkulForm.get('universiteucreti').invalid:
          Swal.fire('Üniversite ücretiniz girmediniz.');
          break;
        case this.onOkulForm.get('bursturu').invalid:
          Swal.fire('Üniversite burs türünü girmediniz.');
          break;
        case this.onOkulForm.get('bitirilenlise').invalid:
          Swal.fire('Bitirdiğiniz liseyi girmediniz.');
          break;
        case this.onOkulForm.get('lisetipi').invalid:
          Swal.fire('lise tipini girmediniz.');
          break;
        case this.onOkulForm.get('liseturu').invalid:
          Swal.fire('Lise türü girmediniz.');
          break;
        default:
          break;
      }
      return;
    }

    /*
  if (this.onBankaForm.invalid) {
    switch (this.onBankaForm.invalid) {
      case this.onBankaForm.get('banka').invalid:
        Swal.fire('Banka bilgisi girmediniz.');
        break;
      case this.onBankaForm.get('subekodu').invalid:
        Swal.fire('Şube Kodu bilgisini girmediniz.');
        break;
      case this.onBankaForm.get('hesapno').invalid:
        Swal.fire('Hesap No bilgisini girmediniz.');
        break;
      case this.onBankaForm.get('ibanno').invalid:
        Swal.fire('İBAN No girmediniz.');
        break;
      case this.onBankaForm.get('ibansahibi').invalid:
        Swal.fire('İBAN Sahibi girmediniz.');
        break;
      case this.onBankaForm.get('ibansahibitc').invalid:
        Swal.fire('İBAN Sahibi T.C.  girmediniz.');
        break;
      default:
        break;
    }
    return;
  }

  if (this.onSosyoEkonomiForm.invalid) {
    switch (this.onSosyoEkonomiForm.invalid) {
      case this.onSosyoEkonomiForm.get('annebababirliktelik').invalid:
        Swal.fire('Anne Baba Birliktelik girmediniz.');
        break;
      case this.onSosyoEkonomiForm.get('ailedigergelirtoplam').invalid:
        Swal.fire('Aile Diğer Gelirler Toplamı girmediniz.');
        break;
      case this.onSosyoEkonomiForm.get('ailedigergeliraciklama').invalid:
        Swal.fire('Aile Diğer Gelir Açıklama girmediniz.');
        break;
      case this.onSosyoEkonomiForm.get('aileikametadresi').invalid:
        Swal.fire('Aile İkamet Adresi girmediniz.');
        break;
      case this.onSosyoEkonomiForm.get('ailemulkdurum').invalid:
        Swal.fire('Aile Mülk Durum girmediniz.');
        break;
      case this.onSosyoEkonomiForm.get('ailekira').invalid:
        Swal.fire('Aile Kira  girmediniz.');
        break;
      case this.onSosyoEkonomiForm.get('ailesaglik').invalid:
        Swal.fire('Aile Sağlık  girmediniz.');
        break;
      default:
        break;
    }
    return;
  }

  if (this.onKardesForm.invalid) {
    switch (this.onKardesForm.invalid) {
      case this.onKardesForm.get('kardessayisi').invalid:
        Swal.fire('Kardeş Sayısı girmediniz.');
        break;
      default:
        break;
    }
    return;
  }

  if (this.onKisiselForm.invalid) {
    switch (this.onKisiselForm.invalid) {
      case this.onKisiselForm.get('aileileberaber').invalid:
        Swal.fire('Aile ile Beraber bilgisi girmediniz.');
        break;
      case this.onKisiselForm.get('ailedenayri').invalid:
        Swal.fire('Aileden Ayrı bilgisini girmediniz.');
        break;
      case this.onKisiselForm.get('ikametyeri').invalid:
        Swal.fire('İkamet Yeri bilgisini girmediniz.');
        break;
      case this.onKisiselForm.get('yurtadi').invalid:
        Swal.fire('Yurt Adi girmediniz.');
        break;
      case this.onKisiselForm.get('evyurtkirasi').invalid:
        Swal.fire('Yurt Kirası girmediniz.');
        break;
      case this.onKisiselForm.get('evyurtdiger').invalid:
        Swal.fire('Ev Yurt Diğer bilgisi  girmediniz.');
        break;
      case this.onKisiselForm.get('sagliksorunu').invalid:
        Swal.fire('Sağlık Sorunu bilgisi girmediniz.');
        break;
      case this.onKisiselForm.get('sigara').invalid:
        Swal.fire('Sigara bilgisi  girmediniz.');
        break;
      case this.onKisiselForm.get('ogrenimdekiadres').invalid:
        Swal.fire('Öğrenimdeki Adres bilgisi  girmediniz.');
        break;
      case this.onKisiselForm.get('dernek').invalid:
        Swal.fire('Dernek bilgisi  girmediniz.');
        break;
      case this.onKisiselForm.get('bursveren').invalid:
        Swal.fire('Burs veren bilgisi girmediniz.');
        break;
      case this.onKisiselForm.get('bursmiktari').invalid:
        Swal.fire('Burs miktarı bilgisi girmediniz.');
        break;
      case this.onKisiselForm.get('krediveren').invalid:
        Swal.fire('Kredi veren bilgisi girmediniz.');
        break;
      case this.onKisiselForm.get('kredimiktari').invalid:
        Swal.fire('Kredi miktarı bilgisi girmediniz.');
        break;
      default:
        break;
    }
    return;
  }

  if (this.onEvrakForm.invalid) {
    switch (this.onEvrakForm.invalid) {
      case this.onEvrakForm.get('ikametgah').invalid:
        Swal.fire('İkamet belgesi eklemdiniz.');
        break;
      case this.onEvrakForm.get('sabikakaydi').invalid:
        Swal.fire('Sabıka kayıd belgesi eklemediniz.');
        break;
      case this.onEvrakForm.get('ogrencibelgesi').invalid:
        Swal.fire('Öğrenci Belgesi eklemediniz.');
        break;
      case this.onEvrakForm.get('transkript').invalid:
        Swal.fire('Transkrip belgesi eklemediniz.');
        break;
      case this.onEvrakForm.get('nufuscuzdani').invalid:
        Swal.fire('Nüfus cüzdanı belgesi eklemediniz.');
        break;
      case this.onEvrakForm.get('hesapcuzdani').invalid:
        Swal.fire('Banka Hesap Cüzdanı belgesi eklemediniz.');
        break;
      default:
        break;
    }
    return;
  }
  */
    this.ogrenciService.setOkulKayit(this.onOkulForm.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data === 1) {
          this.toastr.success('Okul Bilgisi Kaydı Başarılı.', 'Bilgilendirme');
        } else {
          this.toastr.error(data, 'Hata');
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
