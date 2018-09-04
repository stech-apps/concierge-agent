import { Store } from '@ngrx/store';
import { Injectable, Pipe } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { switchMap, tap, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';

import * as AppointmentActions from './../actions';
import { AppointmentDataService } from '../services';
import { IAppState, DataServiceError } from 'src/store';
import * as moment from 'moment';
import { IAppointmentState } from 'src/store/reducers/appointment.reducer';
import { ToastService } from 'src/util/services/toast.service';

const toAction = AppointmentActions.toAction();

@Injectable()
export class AppointmentEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<IAppState>,
    private translate: TranslateService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private appointmentDataService: AppointmentDataService
  ) { }

  @Effect()
  searchAppointments$: Observable<Action> = this.actions$
    .ofType(AppointmentActions.SEARCH_APPOINTMENTS)
    .pipe(
    switchMap((action: AppointmentActions.SearchAppointments) =>
      toAction(
        this.appointmentDataService.searchAppointments(action.payload),
        AppointmentActions.SearchAppointmentsSuccess,
        AppointmentActions.SearchAppointmentsFail
      )
    )
    );

  @Effect()
  searchCalendarAppointments$: Observable<Action> = this.actions$
    .ofType(AppointmentActions.SEARCH_CALENDAR_APPOINTMENTS)
    .pipe(
    switchMap((action: AppointmentActions.SearchAppointments) =>
      toAction(
        this.appointmentDataService.searchCalendarAppointments(action.payload),
        AppointmentActions.SearchCalendarAppointmentsSuccess,
        AppointmentActions.SearchCalendarAppointmentsFail
      )
    )
    );

  @Effect()
  deleteAppointment$: Observable<Action> = this.actions$
    .ofType(AppointmentActions.DELETE_APPOINTMENT)
    .pipe(
    switchMap((action: AppointmentActions.DeleteAppointment) =>
      this.appointmentDataService.deleteAppointment(action.payload).pipe(
        mergeMap(() => [new AppointmentActions.DeleteAppointmentSuccess(action.payload, action.succssCallBack)]),
        catchError((err: DataServiceError<any>) => of(new AppointmentActions.DeleteAppointmentFail(err))),
      )
    )
    );

  @Effect()
  deleteAppointmentSuccess$: Observable<Action> = this.actions$
    .ofType(AppointmentActions.DELETE_APPOINTMENT_SUCCESS)
    .pipe(
    tap((action: AppointmentActions.DeleteAppointmentSuccess) => {
      action.succssCallBack();
    }),
    withLatestFrom(this.store$.select((state: IAppState) => state.appointments)),
    switchMap(() => {
      return this.translateService.get('appointment_deleted_success');
    }),
    switchMap((v) => {
      var successMessage = {
        firstLineName: v,
        firstLineText: '',
        icon: "correct"
      }
      return [new AppointmentActions.UpdateMessageInfo(successMessage)]
    })
    );

  @Effect({ dispatch: false })
  deleteAppointmentFailed$: Observable<Action> = this.actions$
    .ofType(AppointmentActions.DELETE_APPOINTMENT_FAIL)
    .pipe(
    tap((action: AppointmentActions.DeleteAppointmentFail) => {
      this.toastService
        .infoToast('toast.cancel.booking.error');
    }));

}
