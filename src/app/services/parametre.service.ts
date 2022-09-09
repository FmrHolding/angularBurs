import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametreService {

  constructor(private httpClient: HttpClient) { }

  public getFirma(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'parameter/firma');
  }

  public getLiseTur(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'parameter/lisetur');
  }

  public getLise(turid: number): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'parameter/lise?turid=' + turid);
  } 

  public getSinif(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'parameter/sinif');
  }

  public getUniversite(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'parameter/universite');
  }

  public getFakulte(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'parameter/fakulte');
  }

  public getBanka(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'Parameter/banka');
  }

  public getMezuniyet(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'parameter/mezuniyet');
  }

  public getIkamet(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'parameter/ikamet');
  }

  public getMulk(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.apiURL + 'parameter/mulk');
  }
}
