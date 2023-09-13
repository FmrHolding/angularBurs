import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SosyoekonomikService {

  constructor(private httpClient: HttpClient) { }

  public getEkonomik(ogrenciid:number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'ekonomik/get?ogrenciid=' + ogrenciid);
  }

  public setEkonomikKayit(ekonomik: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'ekonomik/insert', ekonomik);
  }

  public setEkonomikGuncelle(ekonomik: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'ekonomik/update', ekonomik);
  }

}
