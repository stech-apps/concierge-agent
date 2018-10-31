import { Directive } from '@angular/core';
import {NG_VALIDATORS} from '@angular/forms';
import { whiteSpaceValidatorSynchrounous } from 'src/util/custom-form-validators';


@Directive({
  selector: '[qmAllWhiteSpace]',
  providers: [{
    provide: NG_VALIDATORS, 
    useValue: whiteSpaceValidatorSynchrounous, 
    multi: true 
  }]
})
export class QmAllWhiteSpaceDirective {

  constructor() { }

}
