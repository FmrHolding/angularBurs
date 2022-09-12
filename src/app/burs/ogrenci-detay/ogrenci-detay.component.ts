import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ogrenci-detay',
  templateUrl: './ogrenci-detay.component.html'
})
export class OgrenciDetayComponent implements OnInit {

  ogrenciId: number;
  tabName: string = null;
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.ogrenciId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.tabName='Evrak'
  }

  onTapUpdate(event): void {
    this.tabName=null;
    this.tabName = event.tabName;
  }
}
