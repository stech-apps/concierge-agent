import { Directive } from '@angular/core';
import {NG_ASYNC_VALIDATORS } from '@angular/forms';
import { validateNotEqualToFactory } from 'src/util/custom-form-validators';

@Directive({
  selector: '[qmPhoneNumberValidator]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS, 
    useValue: validateNotEqualToFactory, 
    multi: true 
  }]
})
export class QmPhoneNumberValidatorDirective {

  constructor() { }

}
