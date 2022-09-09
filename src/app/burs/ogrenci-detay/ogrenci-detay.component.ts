import { Component,  OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ogrenci-detay',
  templateUrl: './ogrenci-detay.component.html'
})
export class OgrenciDetayComponent implements OnInit {

  ogrenciId:number;
  constructor(
    private route: ActivatedRoute
  ) {  }

  ngOnInit(): void {
    this.ogrenciId = parseInt(this.route.snapshot.paramMap.get('id'));
  }

}
