import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankaService {

  constructor(private httpClient: HttpClient) { }

  public getBanka(ogrenciid:number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'banka/get?ogrenciid=' + ogrenciid);
  }

  public setBankaKayit(banka: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'banka/insert', banka);
  }

  public setBankaGuncelle(banka: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'banka/update', banka);
  }

}
