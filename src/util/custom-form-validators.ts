import { tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NG_VALIDATORS, FormControl, Validator, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ServicePointSelectors } from '../store';
// import { ServicePointSelectors } from "../../../../store";


export function whiteSpaceValidator(control: FormControl) {
    const whiteSpaceErrorObject = { 'allwhitespace': true };
    return of(control.value).pipe(
        map(v => {
            const isAllWhiteSpace = control.value && control.value.trim().length === 0;
            const isValid: boolean = !isAllWhiteSpace;
            if (!isValid && control.dirty) {
                control.setErrors(whiteSpaceErrorObject);
            }
            return !control.dirty || isValid ? null : whiteSpaceErrorObject;
        }));

}

export function whiteSpaceValidatorSynchrounous(control: FormControl) {
    const whiteSpaceErrorObject = { 'allwhitespace': true };

    const isAllWhiteSpace = control.value && control.value.trim().length === 0;
    const isValid: boolean = !isAllWhiteSpace;
    if (!isValid && control.dirty) {
        control.setErrors(whiteSpaceErrorObject);
    }
    return !control.dirty || isValid ? null : whiteSpaceErrorObject;

}

export function validateNotEqualToFactory(c: FormControl, servicePointSelectors: ServicePointSelectors): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

        return new Promise(function (resolve, reject) {

            servicePointSelectors.uttParameters$.subscribe(cc => {

                if(c.value == cc.countryCode) {
                    resolve({ phoneInvalid: true });
                }
                else {
                    resolve(null);
                }
               
            });

        });
    };
}
