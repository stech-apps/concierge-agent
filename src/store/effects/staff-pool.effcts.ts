import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store/src/models';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as AllActions from './../actions';
import { StaffPoolDataService } from '../services';
import { FetchStaffPool } from './../actions';

const toAction = AllActions.toAction();

@Injectable()
export class StaffPoolEffects {
    constructor(
      private actions$: Actions,
      private staffPoolDataService: StaffPoolDataService
    ) {}

    @Effect()
    getStaffPool$: Observable<Action> = this.actions$
      .pipe(
        ofType(AllActions.FETCH_STAFF_POOL),
        switchMap((fetchQueueRequest: FetchStaffPool) =>
          toAction(
            this.staffPoolDataService.getStaffPool(fetchQueueRequest.payload),
            AllActions.FetchStaffPoolSuccess,
            AllActions.FetchStaffPoolFail
          )
        )
      );
}
