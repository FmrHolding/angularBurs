import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { OgrenciService } from 'src/app/services/ogrenci.service';
import { ParametreService } from 'src/app/services/parametre.service';

@Component({
  selector: 'app-ogrenci-universite',
  templateUrl: './ogrenci-universite.component.html'
})

export class OgrenciUniversiteComponent implements OnInit,OnDestroy {

  public frmOkul: FormGroup;
  public liseler: any[];
  public lisetipleri: any[];
  public universitler: any[];
  public universitesinif: any[];
  public universitetipleri: any[];
  public universiteburslar: any[];
  private ngUnsubscribe$ = new Subject<void>();


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private parametreService: ParametreService,
    private ogrenciService: OgrenciService,
    private toastr: ToastrService
  ) {
    this.frmOkul = this.fb.group({
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
  }

  ngOnInit(): void {
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

  onLiseTipi(event): void {
    if (event !== undefined) {
      this.frmOkul.get('lisetipi').setValue(event.id);
    } else {
      this.frmOkul.get('lisetipi').setValue(null);
    }
  }

  onLiseTuru(event): void {
    if (event !== undefined) {
      this.frmOkul.get('liseturu').setValue(event.id);
    } else {
      this.frmOkul.get('liseturu').setValue(null);
    }
  }

  onUniversite(event): void {
    if (event !== undefined) {
      this.frmOkul.get('universiteid').setValue(event.id);
    } else {
      this.frmOkul.get('universiteid').setValue(null);
    }
  }

  onUniversiteSinif(event): void {
    if (event !== undefined) {
      this.frmOkul.get('sinif').setValue(event.id);
    } else {
      this.frmOkul.get('sinif').setValue(null);
    }
  }

  onUniversiteTipi(event): void {
    if (event !== undefined) {
      this.frmOkul.get('universitetipi').setValue(event.id);
    } else {
      this.frmOkul.get('universitetipi').setValue(null);
    }
  }

  onUniversiteBursTuru(event): void {
    if (event !== undefined) {
      this.frmOkul.get('bursluluk').setValue(event.id);
    } else {
      this.frmOkul.get('bursluluk').setValue(null);
    }
  }


  /*
  this.ogrenciService.setOkulKayit(this.frmOkul.value).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
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
*/

ngOnDestroy(): void {
  this.ngUnsubscribe$.next();
  this.ngUnsubscribe$.complete();
}


}
