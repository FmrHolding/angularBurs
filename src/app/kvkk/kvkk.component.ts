import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CihazipService } from '../services/cihazip.service';

@Component({
  selector: 'app-kvkk',
  templateUrl: './kvkk.component.html',
  styles: [
  ]
})
export class KvkkComponent implements OnInit {

  public kvkkOnay: boolean;

  constructor(
    private router: Router,    
    private ipService: CihazipService
    ) { }

  ngOnInit(): void {
    localStorage.removeItem('kvkkOnay');
    this.kvkkOnay = false;
    this.getIP();
  }

  getIP(): void {
    this.ipService.getIPAddress().subscribe((res: any) => {
    });
  }

  isChecked(event): void {
    if (event.target.checked) {
      this.kvkkOnay = true;
      localStorage.setItem('kvkkOnay', 'true');
    } else {
      this.kvkkOnay = false;
      localStorage.setItem('kvkkOnay','false');
    }
  }

  onOgrenciForm(): void {
    this.router.navigate(['/giris']);
  }

}
