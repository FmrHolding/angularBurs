import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniversiteService {

  constructor(private httpClient: HttpClient) { }

  public getUniversite(ogrenciid:number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'universite/get?ogrenciid=' + ogrenciid);
  }

  public setUniversiteKayit(universite: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'universite/insert', universite);
  }

  public setUniversiteGuncelle(universite: any): Observable<any> {
    return this.httpClient.put<any>(environment.apiURL + 'universite/update', universite);
  }

}
