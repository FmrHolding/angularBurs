import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-ogrenci-detay',
  templateUrl: './ogrenci-detay.component.html'
})
export class OgrenciDetayComponent implements OnInit {

  data: any = [];
  tabName: string = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStore: StoreService
  ) { }

  ngOnInit(): void {
    if (this.localStore.getData('kvkkOnay') === 'true') {
      const ogrenciId = parseInt(this.localStore.getData('ogrenciId'));
      const islemId = parseInt(this.localStore.getData('IslemId'));
      this.data = ({
        ogrenciId: ogrenciId,
        islemId: islemId
      })
      this.tabName = 'Lise'
    } else {
      this.router.navigate(['/kvkk']);
    }
  }

  onTapUpdate(event): void {
    this.tabName = null;
    this.tabName = event.tabName;
  }
}
