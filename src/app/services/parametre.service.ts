import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametreService {

  constructor(private httpClient: HttpClient) { }

  public getFirmalar(): Observable<any[]> {
    let reqheaders = new HttpHeaders();
    reqheaders = reqheaders.append('Content-Type', 'application/json');
    return this.httpClient.get<any[]>(environment.apiURL + 'parameter/firma',
      { headers: reqheaders });
  }

  public getUniversiteler(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'Parameter/universiteler');
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
    return this.httpClient.get<any[]>(environment.apiURL + 'Parameter/bankalar');
  }

  public getOgrenimler(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/ogrenimler');
  }

  public getLiseTipleri(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/lisetipleri');
  }


  public getIkametEdilecekYer(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/ikametedilecekyer');
  }

  public getKardesSayilari(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/kardessayilari');
  }

  public getOturduguEv(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'detay/oturduguev');
  }
}
