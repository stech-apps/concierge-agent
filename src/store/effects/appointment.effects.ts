import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import * as AppointmentActions from './../actions';
import { AppointmentDataService } from '../services';

const toAction = AppointmentActions.toAction();

@Injectable()
export class AppointmentEffects {
  constructor(
    private actions$: Actions,
    private translate: TranslateService,
    private AppointmentDataService: AppointmentDataService
  ) {}

  @Effect()
  searchAppointments$: Observable<Action> = this.actions$
    .ofType(AppointmentActions.SEARCH_APPOINTMENTS)
    .pipe(
      switchMap((action: AppointmentActions.SearchAppointments) =>
        toAction(
          this.AppointmentDataService.searchAppointments(action.payload),
          AppointmentActions.SearchAppointmentsSuccess,
          AppointmentActions.SearchAppointmentsFail
        )
      )
    );
}
