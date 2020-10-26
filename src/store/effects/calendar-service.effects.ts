import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store/src/models';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as AllActions from './../actions';
import { CalendarServiceDataService } from '../services';

const toAction = AllActions.toAction();

@Injectable()
export class CalendarServiceEffects {
    constructor(
      private actions$: Actions,
      private serviceDataService: CalendarServiceDataService
    ) {}

      @Effect()
    getCalendarServices$: Observable<Action> = this.actions$
      .pipe(
        ofType(AllActions.FETCH_CALENDAR_SERVICES),
        switchMap((action: AllActions.FetchCalendarServices) =>
          toAction(
            this.serviceDataService.getCalendarServices(action.payload),
            AllActions.FetchCalendarServicesSuccess,
            AllActions.FetchCalendarServicesFail
          )
        )
      );

    @Effect()
    getServiceGroups$: Observable<Action> = this.actions$
      .pipe(
        ofType(AllActions.FETCH_SERVICE_GROUPS),
        switchMap((action: AllActions.FetchServiceGroups) =>
          toAction(
            this.serviceDataService.getServiceGroups(action.payload, action.branch, action.multiServiceEnabled),
            AllActions.FetchServiceGroupsSuccess,
            AllActions.FetchServiceGroupsFail
          )
        )
      );
}
