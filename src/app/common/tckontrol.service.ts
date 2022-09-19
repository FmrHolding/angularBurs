import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TckontrolService {

  constructor() { }

  tckKontrol(tckno: string): boolean {
    const bir = parseInt(tckno[0]);
    const iki = parseInt(tckno[1]);
    const uc = parseInt(tckno[2]);
    const dort = parseInt(tckno[3]);
    const bes = parseInt(tckno[4]);
    const alti = parseInt(tckno[5]);
    const yedi = parseInt(tckno[6]);
    const sekiz = parseInt(tckno[7]);
    const dokuz = parseInt(tckno[8]);
    const on = parseInt(tckno[9]);
    const onbir = parseInt(tckno[10]);

    const tekler = (bir + uc + bes + yedi + dokuz) * 7;
    const ciftler = (iki + dort + alti + sekiz);
    const cikart = tekler - ciftler;
    const mod10bir = cikart % 10;
    const toplam = (bir + iki + uc + dort + bes + alti + yedi + sekiz + dokuz + mod10bir);
    const mod10iki = toplam % 10;
    const soniki = mod10bir + mod10iki;
    const _soniki = on + onbir;
    if(toplam===0) return false;
    else if (soniki === _soniki) return true;
    else return false;
  }
}
