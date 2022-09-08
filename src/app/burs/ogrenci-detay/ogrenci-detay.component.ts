import { Component,  OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ogrenci-detay',
  templateUrl: './ogrenci-detay.component.html'
})
export class OgrenciDetayComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) {  }

  ngOnInit(): void {
    const ogrenciNo = parseInt(this.route.snapshot.paramMap.get('id'));
  }

}
