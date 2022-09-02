import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CihazipService {

  constructor(private httpClient: HttpClient) { }

  public getIPAddress(): Observable<any> {
    return this.httpClient.get('http://api.ipify.org/?format=json');
  }
}
