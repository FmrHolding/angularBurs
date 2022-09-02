import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametreService {

  constructor(private httpClient: HttpClient) { }

  public getFirmalar(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'burs/firmalar');
  }

  public getUniversiteler(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/universiteler');
  }

  public getUniversiteSinif(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/universitesinif');
  }

  public getUniversiteBurslar(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/universiteburslar');
  }

  public getUniversiteTipleri(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/universitetipleri');
  }

  public getLiseler(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/liseler');
  }

  public getBankalar(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/bankalar');
  }

  public getOgrenimler(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/ogrenimler');
  }

  public getLiseTipleri(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/lisetipleri');
  }

  public getAileBeraber(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/aileberaber');
  }

  public getAileBirliktelik(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/ailebirliktelik');
  }

  public getAiledenAyri(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/ailedenayri');
  }

  public getIkametEdilecekYer(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/ikametedilecekyer');
  }

  public getIsDurum(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/isdurum');
  }

  public getKardesSayilari(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/kardessayilari');
  }

  public getMedeniDurum(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/medenidurum');
  }

  public getOturduguEv(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/oturduguev');
  }

  public getSigaraDurumu(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/sigaradurumu');
  }
}
