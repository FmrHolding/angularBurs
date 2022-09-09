import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OgrenciService {

  constructor(private httpClient: HttpClient) { }

  public getOgrenciGetir(tckimlik): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'burs/ogrencigetir?tckimlik=' + tckimlik);
  }

  public setOgrenciKayit(ogrenci: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiURL + 'ogrenci/ogrenci', ogrenci);
  }

  public setUniversiteKayit(universite: any): Observable<any> {
    return this.httpClient.post(environment.apiURL + 'ogrenci/universite', universite);
  }

  public setBankaKayit(banka: any): Observable<any> {
    return this.httpClient.post(environment.apiURL + 'ogrenci/banka', banka);
  }

  public setEkonomikKayit(ekonomik: any): Observable<any> {
    return this.httpClient.post(environment.apiURL + 'ogrenci/ekonomik', ekonomik);
  }

  public setKardesKayit(kardes: any): Observable<any> {
    return this.httpClient.post(environment.apiURL + 'ogrenci/kardes', kardes);
  }

  public setKisiselKayit(kisisel: any): Observable<any> {
    return this.httpClient.post(environment.apiURL + 'ogrenci/kisisel', kisisel);
  }

  public setReferansKayit(referans: any): Observable<any> {
    return this.httpClient.post(environment.apiURL + 'ogrenci/referans', referans);
  }

  public setEvrakKayit(evrak: any): Observable<any> {
    return this.httpClient.post(environment.apiURL + 'ogrenci/evrak', evrak);
  }
}
