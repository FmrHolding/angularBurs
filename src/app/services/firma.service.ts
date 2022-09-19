import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {

  constructor(private httpClient: HttpClient) { }

  public getFirma(ogrenciid:number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'firma/get?ogrenciid=' + ogrenciid);
  }

  public setFirmaKayit(firma: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'firma/insert', firma);
  }

  public setFirmaGuncelle(firma: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'firma/update', firma);
  }
}
