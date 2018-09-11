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
        catchError((err: DataServiceError<any>) => of(new AppointmentActions.DeleteAppointmentFail(err, action.errorCallback))),
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

  @Effect()
  deleteAppointmentFailed$: Observable<Action> = this.actions$
    .ofType(AppointmentActions.DELETE_APPOINTMENT_FAIL)
      .pipe(
    switchMap((action: AppointmentActions.RescheduleAppointmentFail) => {
      return this.translateService.get(['appointment_deleted_fail']).pipe(
        switchMap((messages) => {
          var errorMessage = {
            firstLineName: messages['appointment_deleted_fail'],
            icon: "error"
          };

          this.toastService.infoToast((((action.payload["responseData"] || "")["error"] || "")["msg"] || ""));
          return [new AppointmentActions.UpdateMessageInfo(errorMessage)]
        })
      );
    }));

  @Effect()
  rescheduleAppointment$: Observable<Action> = this.actions$
    .ofType(AppointmentActions.RESCHEDULE_APPOINTMENT)
    .pipe(
    switchMap((action: AppointmentActions.RescheduleAppointment) =>
      this.appointmentDataService.rescheduleAppointment(action.payload).pipe(
        mergeMap(() => [new AppointmentActions.RescheduleAppointmentSuccess(action.payload)]),
        catchError((err: DataServiceError<any>) => of(new AppointmentActions.RescheduleAppointmentFail(err))),
      )
    )
    );

  @Effect()
  rescheduleAppointmentSuccess$: Observable<Action> = this.actions$
    .ofType(AppointmentActions.RESCHEDULE_APPOINTMENT_SUCCESS)
    .pipe(
    switchMap((action: AppointmentActions.RescheduleAppointmentSuccess) => {
      return this.translateService.get(['appointment_reschedule_success', 'appointment_new_date_time']).pipe(
        switchMap((messages) => {
          var successMessage = {
            firstLineName: messages['appointment_reschedule_success'],
            firstLineText: action.payload.branch.name,
            icon: "correct",
            LastLineName: messages['appointment_new_date_time'],
            LastLineText: action.payload.start.replace('T', ', ')
          }
          return [new AppointmentActions.UpdateMessageInfo(successMessage)]
        })
      );
    })
    );

  @Effect()
  rescheduleAppointmentFailed$: Observable<Action> = this.actions$
    .ofType(AppointmentActions.RESCHEDULE_APPOINTMENT_FAIL)
    .pipe(
    switchMap((action: AppointmentActions.RescheduleAppointmentFail) => {
      return this.translateService.get(['appointment_reschedule_fail']).pipe(
        switchMap((messages) => {
          var errorMessage = {
            firstLineName: messages['appointment_reschedule_fail'],
            icon: "error"
          };

          this.toastService.infoToast(action.payload["errorMsg"]);
          return [new AppointmentActions.UpdateMessageInfo(errorMessage)]
        })
      );
    }));
}
