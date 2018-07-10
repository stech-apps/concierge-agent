import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store/src/models';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as AllActions from './../actions';
import { ServicePointDataService } from '../services';

const toAction = AllActions.toAction();

@Injectable()
export class ServicePointEffects {
    constructor(
      private actions$: Actions,
      private servicePointDataService: ServicePointDataService
    ) {}

    @Effect()
    getServices$: Observable<Action> = this.actions$
      .ofType(AllActions.FETCH_SERVICEPOINTS)
      .pipe(
        switchMap(() =>
          toAction(
            this.servicePointDataService.getServicePoints(),
            AllActions.FetchServicePointsSuccess,
            AllActions.FetchServicePointsFail
          )
        )
      );
}
