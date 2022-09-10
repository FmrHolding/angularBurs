import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvrakService {

  constructor(private httpClient: HttpClient) { }

  public getEvrak(id:number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'evrak/get?id=' + id);
  }

  public getEvraklar(ogrenciid:number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'evrak/getall?ogrenciid=' + ogrenciid);
  }


  public setEvrakKayit(evrak: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'evrak/insert', evrak);
  }

  public setEvrakGuncelle(evrak: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'evrak/update', evrak);
  }

}
