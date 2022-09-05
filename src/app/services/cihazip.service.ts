import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CihazipService {

  constructor(private httpclient: HttpClient) { }

  public getDeviceIp(): Observable<string> {
    return this.httpclient.get<string>('https://api.ipify.org/?format=json');
  }
}
