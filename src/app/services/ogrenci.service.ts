import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap, Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OgrenciService {

  constructor(private httpClient: HttpClient) { }

  public getOgrenci(tckimlik: string): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'ogrenci/get?tckimlik=' + tckimlik);
  }

  public setOgrenciKayit(ogrenci: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'ogrenci/insert', ogrenci);
  }

  public setOgrenciUpdate(ogrenci: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'ogrenci/update', ogrenci);
  }

  public setOgrenciEndtoBurs(ogrenciid: number): Observable<any> {
    return this.httpClient.get<any>(environment.apiURL + 'ogrenci/closed?id=' + ogrenciid);
  }
}
