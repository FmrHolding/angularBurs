import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap, Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferansService {

  constructor(private httpClient: HttpClient) { }

  public getReferans(id: number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'referans/get?id=' + id);
  }

  public getReferanslar(ogrenciid: number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'referans/getall?ogrenciid=' + ogrenciid);
  }

  public setReferansKayit(referans: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'referans/insert', referans)
      .pipe(retry(1),
        mergeMap(
          data => this.httpClient.get<any[]>(environment.apiURL + "referans/get?id=" + data.value)));
  }

  public setReferansGuncelle(referans: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'referans/update', referans);
  }

}
