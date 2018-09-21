import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store/src/models';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as AllActions from './../actions';
import { CalendarBranchDataService } from '../services/calendar-branch';

const toAction = AllActions.toAction();

@Injectable()
export class CalendarBranchEffects {
    constructor(
      private actions$: Actions,
      private branchDataService: CalendarBranchDataService
    ) {}

    @Effect()
    getCalendarBranches$: Observable<Action> = this.actions$
      .ofType(AllActions.FETCH_CALENDAR_BRANCHES)
      .pipe(
        switchMap((action: AllActions.FetchCalendarBranches) =>
          toAction(
            this.branchDataService.getCalendarBranches(),
            AllActions.FetchCalendarBranchesSuccess,
            AllActions.FetchCalendarBranchesFail
          )
        )
      );

    @Effect()
    getPublicCalendarBranches$: Observable<Action> = this.actions$
      .ofType(AllActions.FETCH_PUBLIC_CALENDAR_BRANCHES)
      .pipe(
        switchMap(() =>
          toAction(
            this.branchDataService.getCalendarPublicBranches(),
            AllActions.FetchPublicCalendarBranchesSuccess,
            AllActions.FetchPublicCalendarBranchesFail
          )
        )
      );
}
