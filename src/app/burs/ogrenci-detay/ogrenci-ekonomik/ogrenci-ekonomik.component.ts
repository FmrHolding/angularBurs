import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ParametreService } from 'src/app/services/parametre.service';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeTr, 'tr');

@Component({
  selector: 'app-ogrenci-ekonomik',
  templateUrl: './ogrenci-ekonomik.component.html'
})
export class OgrenciEkonomikComponent implements OnInit,OnDestroy {

  frmEkonomik:FormGroup;
  oturduguev:any=[];
  ailebirlikteligi:any=[];
  ogrenimler:any=[];
  aileberaber:any=[];
  ailedenberaber:any=[];
  ikametedilecekyer:any=[];
  anneolu:boolean=false;
  babaolu:boolean=false;
  private ngUnsubscribe$=new Subject<void>();

  constructor(
    private parameterService:ParametreService,
    private fb:FormBuilder,
    private toastr:ToastrService
  ) {
    this.frmEkonomik = this.fb.group({
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
   }

  ngOnInit(): void {
  }

  getIkametEdilecekYer(): void {
    this.parameterService.getIkametEdilecekYer().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.ikametedilecekyer = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  getOgrenimler(): void {
    this.parameterService.getOgrenimler().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: any) => {
        this.ogrenimler = data;
      },
      error: (err) => this.toastr.error(err, 'Hata')
    });
  }

  onAnneBabaBirliktelik(event):void{
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
    } else {
      this.anneolu = false;
      this.babaolu = false;
    }
  }

  onBabaOgrenim(event):void{
    if (event !== undefined) {
      this.frmEkonomik.get('babaogrenim').setValue(event.id);
    } else {
      this.frmEkonomik.get('babaogrenim').setValue(null);
    }
  }

  onAnneOgrenim(event):void{
    if (event !== undefined) {
      this.frmEkonomik.get('anneogrenim').setValue(event.id);
    } else {
      this.frmEkonomik.get('anneogrenim').setValue(null);
    }
  }

  onAileMulkDurum(event):void{
    if (event !== undefined) {
      this.frmEkonomik.get('ailemulkdurum').setValue(event.id);
    } else {
      this.frmEkonomik.get('ailemulkdurum').setValue(null);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next;
    this.ngUnsubscribe$.complete;
  }
}
