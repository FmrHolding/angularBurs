import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tckverify'
})
export class TckverifyPipe implements PipeTransform {

  transform(tckimlik: string, prefix: string): boolean {
    if (!tckimlik || prefix) return false;
    if (prefix.length < 11) return false;
    const bir = parseInt(tckimlik[0]);
    const iki = parseInt(tckimlik[1]);
    const uc = parseInt(tckimlik[2]);
    const dort = parseInt(tckimlik[3]);
    const bes = parseInt(tckimlik[4]);
    const alti = parseInt(tckimlik[5]);
    const yedi = parseInt(tckimlik[6]);
    const sekiz = parseInt(tckimlik[7]);
    const dokuz = parseInt(tckimlik[8]);
    const on = parseInt(tckimlik[9]);
    const onbir = parseInt(tckimlik[10]);

    const tekler = (bir + uc + bes + yedi + dokuz) * 7;
    const ciftler = (iki + dort + alti + sekiz);
    const cikart = tekler - ciftler;
    const mod10bir = cikart % 10;
    const toplam = (bir + iki + uc + dort + bes + alti + yedi + sekiz + dokuz + mod10bir);
    const mod10iki = toplam % 10;
    const soniki = mod10bir + mod10iki;
    const _soniki = on + onbir;
    if (soniki === _soniki) return true;
    else return false;
  }
}
