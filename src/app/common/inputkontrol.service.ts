import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputkontrolService {

  constructor() { }

  inputOnlyChareacter(inputValue: any): boolean {
    const k = inputValue.charCode
    return ((k > 63 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k > 200 && k < 351));
  }

  inputOnlyAlphaChareacter(inputValue: any): boolean {
    const k = inputValue.charCode
    return ((k > 63 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || (k > 200 && k < 351));
  }

  inputOnlyNumber(inputValue: any): boolean {
    const k = inputValue.charCode
    return (k > 47 && k < 58);
  }
}
