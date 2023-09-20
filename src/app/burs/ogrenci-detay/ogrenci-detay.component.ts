import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ogrenci-detay',
  templateUrl: './ogrenci-detay.component.html'
})
export class OgrenciDetayComponent implements OnInit {

  data: any = [];
  tabName: string = null;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const routeParams = this.activeRoute.snapshot.params;
    if (localStorage.getItem('kvkkOnay') === 'true') {
      const islemId = parseInt(localStorage.getItem('IslemId'));
      const universite = localStorage.getItem('universite');
      this.data = ({
        ogrenciId: routeParams['id'],
        islemId: islemId,
        universite: universite,
        tckimlik: routeParams['tckimlik'],
        yil: routeParams['year']
      });

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
