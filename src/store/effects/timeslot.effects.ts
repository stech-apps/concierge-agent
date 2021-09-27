import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store/src/models';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, tap } from 'rxjs/operators';

import * as TimeslotActions from './../actions';
import { TimeslotDataService } from '../services';
import { Observable } from 'rxjs';

const toAction = TimeslotActions.toAction();

@Injectable()
export class TimeslotEffects {
    constructor(
      private actions$: Actions,
      private timeslotDataService: TimeslotDataService,
    ) {}

    @Effect()
    getTimeslots$: Observable<Action> = this.actions$
      .pipe(
        ofType(TimeslotActions.FETCH_TIMESLOTS),
        switchMap((action: TimeslotActions.FetchTimeslots) =>
          toAction(
            this.timeslotDataService.getTimeslots(action.payload),
            TimeslotActions.FetchTimeslotsSuccess,
            TimeslotActions.FetchTimeslotsFail
          )
        )
      );
      
  
      @Effect()
      getTimeslotsByVisitors$: Observable<Action> = this.actions$
        .pipe(
          ofType(TimeslotActions.FETCH_TIMESLOTS_BY_VISITORS),
          switchMap((action: TimeslotActions.FetchTimeslotsByVisitors) =>
            toAction(
              this.timeslotDataService.getTimeslotsByVistors(action.payload),
              TimeslotActions.FetchTimeslotsByVisitorsSuccess,
              TimeslotActions.FetchTimeslotsByVisitorsFail
            )
          )
        );
}
