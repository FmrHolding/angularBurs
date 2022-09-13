import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, of } from 'rxjs';
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
    return this.httpClient.post<any>(environment.apiURL + 'referans/insert', referans);
  }

  public setReferansGuncelle(referans: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'referans/update', referans);
  }

  public setReferansCikar(id: number): Observable<any> {
    return this.httpClient.delete<any>(environment.apiURL + 'referans/delete?id=' + id);
  }

}
