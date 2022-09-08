import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ogrenci-evrak',
  templateUrl: './ogrenci-evrak.component.html',
  styles: [
  ]
})
export class OgrenciEvrakComponent implements OnInit {

  frmEvrak:FormGroup;

  constructor() { }

  ngOnInit(): void {
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

}
