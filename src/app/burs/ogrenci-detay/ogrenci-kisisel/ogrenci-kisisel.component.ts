import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeTr, 'tr');

@Component({
  selector: 'app-ogrenci-kisisel',
  templateUrl: './ogrenci-kisisel.component.html'
})
export class OgrenciKisiselComponent implements OnInit {

  frmKisisel:FormGroup;
  aileberaber:any=[];
  ailedenberaber:any=[];
  ikametedilecekyer:any=[];
  sigaradurumu:any=[];
  medenidurumlar:any=[]

  constructor(
    private fb:FormBuilder
  ) {
    this.frmKisisel = this.fb.group({
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
    isdurumu: ['Hayır', [Validators.required]],
    kazancmiktari: [0, [Validators.required]],
    fikirdusunce: [null]
  }); }

  ngOnInit(): void {
  }

  onAileileBeraber(event):void{
    if (event !== undefined) {
      if (event.id === 1) {
        this.ailedenberaber[0].disabled = true;
      }
      this.frmKisisel.get('aileberaber').setValue(event.id);
    } else {
      this.frmKisisel.get('aileberaber').setValue(null);
    }
  }

  onAiledenAyri(event):void{
    if (event !== undefined) {
      this.frmKisisel.get('ailedenayri').setValue(event.id);
    } else {
      this.frmKisisel.get('ailedenayri').setValue(null);
    }
  }

  onIkametYeri(event):void{
    if (event !== undefined) {
      this.frmKisisel.get('ikametyeri').setValue(event.id);
    } else {
      this.frmKisisel.get('ikametyeri').setValue(null);
    }
  }

  onSigara(event):void{
    if (event !== undefined) {
      this.frmKisisel.get('sigara').setValue(event.id);
    } else {
      this.frmKisisel.get('sigara').setValue(null);
    }
  }
}
