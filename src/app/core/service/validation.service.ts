import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  /**
   * required validatior
   * @param control
   * @returns
   */
  static required: ValidatorFn = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    const value = control?.value?.toString().trim();
    if (!value) {
      return { required: true };
    }
    return null;
  };
}
