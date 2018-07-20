import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store/src/models';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import * as AllActions from './../actions';
import { ServiceDataService } from '../services';
import { AllServiceActions } from './../actions';
import { IBranch } from '../../models/IBranch';

const toAction = AllActions.toAction();

@Injectable()
export class ServiceEffects {
    constructor(
      private actions$: Actions,
      private serviceDataService: ServiceDataService
    ) {}

    @Effect()
    getServices$: Observable<Action> = this.actions$
      .ofType(AllActions.FETCH_SERVICES)
      .pipe(
        switchMap((action: AllActions.FetchServices) =>
          toAction(
            this.serviceDataService.getServices(action.payload),
            AllActions.FetchServicesSuccess,
            AllActions.FetchServicesFail
          )
        )
      );

    @Effect()
    getServicesConfiguration$: Observable<Action> = this.actions$
      .ofType(AllActions.FETCH_SERVICE_CONFIGURATION)
      .pipe(
        switchMap((action: AllActions.FetchServiceConfiguration) =>
          toAction(
            this.serviceDataService.getServicesConfiguration(action.branch, action.services),
            AllActions.FetchServiceConfigurationSuccess,
            AllActions.FetchServiceConfigurationFail
          )
        )
      );
}
