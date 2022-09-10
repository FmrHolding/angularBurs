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
    return this.httpClient.get<any[]>(environment.apiURL + 'sosyoekonomik/get?ogrenciid=' + ogrenciid);
  }

  public setEkonomikKayit(ekonomik: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'sosyoekonomik/insert', ekonomik);
  }

  public setEkonomikGuncelle(ekonomik: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'sosyoekonomik/update', ekonomik);
  }

}
