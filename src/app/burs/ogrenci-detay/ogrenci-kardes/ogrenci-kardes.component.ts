import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeTr, 'tr');

@Component({
  selector: 'app-ogrenci-kardes',
  templateUrl: './ogrenci-kardes.component.html'

})
export class OgrenciKardesComponent implements OnInit {

  frmKardes: FormGroup;
  medenidurumlar: any = [];
  isdurumlari: any = [];

  constructor(
    private fb: FormBuilder
  ) {
    this.frmKardes = this.fb.group({
      ogrenciid: [0, [Validators.required]],
      adisoyadi: [null],
      yas: [0],
      okul: [null],
      burs: [0]
    });
  }

  ngOnInit(): void {
  }

}
