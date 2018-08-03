import { tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NG_VALIDATORS, FormControl, Validator } from '@angular/forms';

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