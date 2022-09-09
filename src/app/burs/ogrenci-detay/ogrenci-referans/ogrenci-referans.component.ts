import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ogrenci-referans',
  templateUrl: './ogrenci-referans.component.html',
  styles: [
  ]
})
export class OgrenciReferansComponent implements OnInit {

  frmReferans:FormGroup;
  
  @Input() ogrenciId: number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
