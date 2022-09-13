import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, from, iif, map, mergeMap, Observable, of, retry, take, tap, toArray } from 'rxjs';
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
      .pipe(
        map((data: any) => {
          if (data.statusCode===201) {
            return this.httpClient.get<any[]>(environment.apiURL + "referans/get?id=" + data.value);
          } else {
            return data;
          }
        })
      );
  }

  public setReferansGuncelle(referans: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'referans/update', referans);
  }

}
