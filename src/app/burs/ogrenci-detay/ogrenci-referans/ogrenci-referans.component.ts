import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ogrenci-referans',
  templateUrl: './ogrenci-referans.component.html',
  styles: [
  ]
})
export class OgrenciReferansComponent implements OnInit {

  frmReferans:FormGroup;
  
  constructor() { }

  ngOnInit(): void {
  }

}
