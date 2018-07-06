import { NativeApiService } from 'src/util/services/native-api.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LicenseInfoSelectors } from './../store/services/license/license.selectors';
import { map } from 'rxjs/operators';

@Injectable()
export class LicenseAuthGuard implements CanActivate {
  constructor(private licenseStatusSelector: LicenseInfoSelectors, private router: Router,
              private nativeApiService: NativeApiService) {}

  canActivate(): Observable<boolean> {

    if(this.nativeApiService.isNativeBrowser()) {
      return of(true); // skip license check for mobile
    }

    return this.licenseStatusSelector.getLicenseInfo$.pipe(
        map(licenseState => {
            if (licenseState.loaded) {
               if (licenseState.status) {
                  return true;
               } else {
                 this.router.navigate(['/invalid-license']);
                 return false;
               }
            } else {
              this.router.navigate(['/loading']);
              return false;
            }
          }
        ));
  }
}
