import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { DataServiceError, servicePoint } from 'src/store/services/data.service';
import { GlobalErrorHandler } from '../../../util/services/global-error-handler.service';


@Injectable()
export class SPService implements OnDestroy {

  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {
    
  }

  ngOnDestroy() {
    
  }

  fetchUserStatus() {
    return this.http
      .get(`${servicePoint}/user/status`);
  }

  logout(force: boolean) {
    return this.http
        .put(`${servicePoint}/logout?force=${force}`, {})
        .pipe(
          catchError(this.errorHandler.handleError())
        );
  }
}
