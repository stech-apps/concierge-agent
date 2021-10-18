import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRoleSelectors } from './../store/services/user-role/user-role.selectors';
import 'rxjs/Rx';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable()
export class AccessModuleGuard implements CanActivate {
  constructor(private userRoleSelector: UserRoleSelectors, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.userRoleSelector.userRoleLoaded$
            .pipe(
                filter(status => status === true),
                switchMap(() => {
                    return this.userRoleSelector.isUserAccessApp$;
                }),
                map((canAccess: boolean) => {
                    let isActivated = true;
                    if (!canAccess) {
                        this.router.navigate(['/error'], {
                            queryParams: {
                                'error-label-key': 'label.invalidAccessModules.error'
                            }
                        });

                        isActivated = false;
                    }
                    return isActivated;
                })
            );
  }
}