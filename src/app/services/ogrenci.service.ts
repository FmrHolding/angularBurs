import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OgrenciService {

  constructor(private httpClient: HttpClient    ) { }
  
    public getOgrenciGetir(tckimlik): Observable<any[]> {
      return this.httpClient.get<any[]>(environment.apiURL + 'burs/ogrencigetir?tckimlik=' + tckimlik);
    }
  
    public setOgrenciKayit(ogrenci): Observable<any> {
      return this.httpClient.post(environment.apiURL + 'burs/ogrencikayit', ogrenci);
    }
  
    public setOkulKayit(okul): Observable<any> {
      return this.httpClient.post(environment.apiURL + 'detay/okulkayit', okul);
    }
}
