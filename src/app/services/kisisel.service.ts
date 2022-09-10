import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KisiselService {

  constructor(private httpClient: HttpClient) { }

  public getKisisel(ogrenciid: number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'kisisel/get?ogrenciid=' + ogrenciid);
  }

  public setKisiselKayit(kisisel: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'kisisel/insert', kisisel);
  }

  public setKisiselGuncelle(kisisel: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'kisisel/update', kisisel);
  }

}
