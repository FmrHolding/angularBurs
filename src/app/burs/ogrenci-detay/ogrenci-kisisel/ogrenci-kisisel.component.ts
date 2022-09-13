import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject, takeUntil } from 'rxjs';
import { KisiselService } from 'src/app/services/kisisel.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
registerLocaleData(localeTr, 'tr');

@Component({
  selector: 'app-ogrenci-kisisel',
  templateUrl: './ogrenci-kisisel.component.html'
})
export class OgrenciKisiselComponent implements OnInit {

  frmKisisel: FormGroup;
  EdittoUpdate: boolean = false;
  submitted = false;
  yurtDisable: boolean = false;
  aileberaber: any = [];
  farlkliikamet: any = [];
  ikameteyeri: any = [];
  sigarakullanim: any = [];
  medenidurumlar: any = []
  calismadurumu: any = [];
  private ngUnsubscribe$ = new Subject<void>();

  @Input() ogrenciId: number;
  @Output() tabToUpdate: EventEmitter<any> = new EventEmitter();

  @ViewChild('ngAileBeraber', { static: true }) ngAileBeraber: NgSelectComponent;
  @ViewChild('ngFarkliSehir', { static: true }) ngFarkliSehir: NgSelectComponent;
  @ViewChild('IkametYer', { static: true }) IkametYer: NgSelectComponent;
  @ViewChild('ngSigara', { static: true }) ngSigara: NgSelectComponent;
  @ViewChild('ngIsletme', { static: true }) ngIsletme: NgSelectComponent;

  constructor(
    private kisiselService: KisiselService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.frmKisisel = this.fb.group({
      id:[0,[Validators.required]],
      ogrenciid: [0, [Validators.required]],
      aileileikametid: ['', [Validators.required]],
      farkliikametid: [''],
      ikametyeriid: ['', [Validators.required]],
      yurtadi: ['', [Validators.required]],
      saglikdurumu: ['', [Validators.required]],
      adres: ['', [Validators.required]],
      kira: ['', [Validators.required]],
      diger: ['', [Validators.required]],
      sigaraid: ['', [Validators.required]],
      uyekurum: ['', [Validators.required]],
      kurumburs: ['', [Validators.required]],
      burs: ['', [Validators.required]],
      kurumkredi: ['', [Validators.required]],
      kredi: ['', [Validators.required]],
      calisiyor: ['', [Validators.required]],
      ekgelir: ['', [Validators.required]],
      hakkinda: ['']
    });
  }

  ngOnInit(): void {
    this.getViewKisisel(this.ogrenciId)
    this.frmKisisel.get('ogrenciid').setValue(this.ogrenciId);
    this.getViewAileileIkamet();
    this.getViewFarklIkamet();
    this.getViewIkametYeri();
    this.getViewSigara();
    this.getViewCalismaDurumu();
  }

  get getControlRequest() { return this.frmKisisel.controls; }

  getViewKisisel(ogrenciid: number): void {
    this.kisiselService.getKisisel(ogrenciid).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        if (data.value != null) {
          this.EdittoUpdate = true;
          this.frmKisisel.patchValue(data.value);
        } else {
          this.EdittoUpdate = false;
          this.ngAileBeraber.handleClearClick();
          this.ngFarkliSehir.handleClearClick();
          this.IkametYer.handleClearClick();
          this.ngSigara.handleClearClick();
          this.ngIsletme.handleClearClick();
        }
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getViewAileileIkamet(): void {
    this.aileberaber = [
      { id: 1, cevap: true, aciklama: 'Evet' },
      { id: 2, cevap: false, aciklama: 'Hayır' }
    ]
  }

  getViewFarklIkamet(): void {
    this.farlkliikamet = [
      { id: 1, cevap: true, aciklama: 'Evet' },
      { id: 2, cevap: false, aciklama: 'Hayır' }
    ]
  }

  getViewIkametYeri(): void {
    this.ikameteyeri = [
      { id: 1, aciklama: 'Yurt' },
      { id: 2, aciklama: 'Ev' },
      { id: 3, aciklama: 'Diğer' }
    ]
  }

  getViewSigara(): void {
    this.sigarakullanim = [
      { id: 1, cevap: true, aciklama: 'Evet' },
      { id: 2, cevap: false, aciklama: 'Hayır' }
    ]
  }

  getViewCalismaDurumu(): void {
    this.calismadurumu = [
      { id: 1, cevap: true, aciklama: 'Evet' },
      { id: 2, cevap: false, aciklama: 'Hayır' }
    ]
  }

  onAileileBeraber(event): void {
    if (event !== undefined) {
      this.frmKisisel.get('aileileikametid').setValue(event.cevap);
      if (event.cevap === true) {
        this.ngFarkliSehir.setDisabledState(true);
        this.frmKisisel.get('farkliikametid').setValue(false);
        this.frmKisisel.get('farkliikametid').clearValidators();
      } else {
        this.ngFarkliSehir.setDisabledState(false);
        this.frmKisisel.get('farkliikametid').setValue(null);
        this.ngFarkliSehir.handleClearClick();
        this.frmKisisel.get('farkliikametid').setValidators(Validators.required);
      }
    } else {
      this.frmKisisel.get('aileileikametid').setValue(null);
      this.ngFarkliSehir.setDisabledState(false);
      this.frmKisisel.get('farkliikametid').setValue(null);
      this.ngFarkliSehir.handleClearClick();
      this.frmKisisel.get('farkliikametid').setValidators(Validators.required);
    }
  }

  onAiledenAyri(event): void {
    if (event !== undefined) {
      this.frmKisisel.get('farkliikametid').setValue(event.cevap);
    } else {
      this.frmKisisel.get('farkliikametid').setValue(null);
    }
  }

  onIkametYeri(event): void {
    if (event !== undefined) {
      this.frmKisisel.get('ikametyeriid').setValue(event.id);
      if (event.id === 1) {
        this.yurtDisable = false;
        this.frmKisisel.get('yurtadi').setValue(null);
      } else {
        this.yurtDisable = true;
        this.frmKisisel.get('yurtadi').setValue('YOK');
      }
    } else {
      this.frmKisisel.get('ikametyeriid').setValue(null);
    }
  }

  onSigara(event): void {
    if (event !== undefined) {
      this.frmKisisel.get('sigaraid').setValue(event.cevap);
    } else {
      this.frmKisisel.get('sigaraid').setValue(null);
    }
  }

  onCalisma(event): void {
    if (event !== undefined) {
      this.frmKisisel.get('calisiyor').setValue(event.cevap);
      if(event.cevap===true){
        this.frmKisisel.get('ekgelir').setValue(null);
      }else{        
        this.frmKisisel.get('ekgelir').setValue(0);
      }
    } else {
      this.frmKisisel.get('calisiyor').setValue(null);
    }
  }

  insertBilgi(): void {
    this.submitted = true;
    if (this.frmKisisel.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Kişisel Bilgi Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          this.kisiselService.setKisiselKayit(this.frmKisisel.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              if (data.statusCode === 201) {
                /*
                this.frmKisisel.disable;
                this.ngAileBeraber.setDisabledState(true);
                this.ngFarkliSehir.setDisabledState(true);
                this.IkametYer.setDisabledState(true);
                this.ngSigara.setDisabledState(true);
                this.ngIsletme.setDisabledState(true);
                */
                this.tabToUpdate.emit({ tabName: "Referans" });
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
  }

  updateBilgi(): void {
    this.submitted = true;
    if (this.frmKisisel.invalid) {
      return;
    } else {
      Swal.fire({
        title: 'Kişisel Bilgi Kayıt',
        text: 'Girmiş olduğunuz bilgiler kayıt edilecektir. Onaylıyor musunuz?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Vazgeç',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet'
      }).then((result) => {
        if (result.value) {
          this.kisiselService.setKisiselGuncelle(this.frmKisisel.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (data: any) => {
              /*
              this.frmKisisel.disable;
              this.ngAileBeraber.setDisabledState(true);
              this.ngFarkliSehir.setDisabledState(true);
              this.IkametYer.setDisabledState(true);
              this.ngSigara.setDisabledState(true);
              this.ngIsletme.setDisabledState(true);
              */
              this.tabToUpdate.emit({ tabName: "Referans" });
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

  backBilgi(): void { 
    this.tabToUpdate.emit({ tabName: "Kardes" });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
