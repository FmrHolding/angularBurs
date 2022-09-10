import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KardesService {

  constructor(private httpClient: HttpClient) { }

  public getKardes(id:number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'kardes/get?id=' + id);
  }

  public getKardesler(ogrenciid:number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'kardes/getall?ogrenciid=' + ogrenciid);
  }

  public setKardesKayit(kardes: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'kardes/insert', kardes);
  }

  public setKardesGuncelle(kardes: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'kardes/update', kardes);
  }

}
