import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiseService {

  constructor(private httpClient: HttpClient) { }

  public getLiseGetir(ogrenciid:number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'lise/get?ogrenciid=' + ogrenciid);
  }

  public setLiseKayit(lise: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'lise/insert', lise);
  }

  public setLiseGuncelle(lise: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'lise/update', lise);
  }

}
