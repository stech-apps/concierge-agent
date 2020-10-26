import { Store } from '@ngrx/store';
import { Injectable, Pipe } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { switchMap, tap, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';

import * as AppointmentActions from './../actions';
import { AppointmentDataService, SystemInfoSelectors, UserSelectors } from '../services';
import { IAppState, DataServiceError } from 'src/store';
import * as moment from 'moment';
import { IAppointmentState } from 'src/store/reducers/appointment.reducer';
import { ToastService } from 'src/util/services/toast.service';
import { ERROR_CODE_APPOINTMENT_NOT_FOUND } from 'src/app/shared/error-codes';
import { DEFAULT_LOCALE } from 'src/constants/config';
import { GlobalErrorHandler } from 'src/util/services/global-error-handler.service';

const toAction = AppointmentActions.toAction();

@Injectable()
export class AppointmentEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<IAppState>,
    private translate: TranslateService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private appointmentDataService: AppointmentDataService,
    private systemInfoSelectors: SystemInfoSelectors,
    private userSelectors: UserSelectors,
    private errorHandler: GlobalErrorHandler
  ) { 


  }

  @Effect()
  searchAppointments$: Observable<Action> = this.actions$
  .pipe(
    ofType(AppointmentActions.SEARCH_APPOINTMENTS),
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
    .pipe(
      ofType(AppointmentActions.SEARCH_CALENDAR_APPOINTMENTS),
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
    .pipe(
      ofType(AppointmentActions.DELETE_APPOINTMENT),
      switchMap((action: AppointmentActions.DeleteAppointment) =>
        this.appointmentDataService.deleteAppointment(action.payload).pipe(
          mergeMap(() => [new AppointmentActions.DeleteAppointmentSuccess(action.payload, action.succssCallBack)]),
          catchError((err: DataServiceError<any>) => of(new AppointmentActions.DeleteAppointmentFail(err, action.errorCallback))),
        )
      )
    );


  @Effect()
  deleteAppointmentSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(AppointmentActions.DELETE_APPOINTMENT_SUCCESS),
      tap((action: AppointmentActions.DeleteAppointmentSuccess) => {
        action.succssCallBack();
      }),
      withLatestFrom(this.store$.select((state: IAppState) => state.appointments)),
      switchMap(() => {
        return [new AppointmentActions.UpdateMessageInfo(null)];
      })
    );

  @Effect()
  deleteAppointmentFailed$: Observable<Action> = this.actions$
    .pipe(
      ofType(AppointmentActions.DELETE_APPOINTMENT_FAIL),
      switchMap((action: AppointmentActions.RescheduleAppointmentFail) => {
        return this.translateService.get(['appointment_deleted_fail', 'appointment_not_found_detail']).pipe(
          switchMap((messages) => {
            var errorMessage = {
              firstLineName: messages['appointment_deleted_fail'],
              icon: "error"
            };

            if (action.payload["errorCode"] === ERROR_CODE_APPOINTMENT_NOT_FOUND) {
              this.errorHandler.showError('appointment_not_found_detail', action.payload);
            } else {
              this.errorHandler.showError('appointment_deleted_fail', action.payload);
            }

            return [new AppointmentActions.UpdateMessageInfo(errorMessage)]
          })
        );
      }));

  @Effect()
  rescheduleAppointment$: Observable<Action> = this.actions$    
    .pipe(
      ofType(AppointmentActions.RESCHEDULE_APPOINTMENT),
      switchMap((action: AppointmentActions.RescheduleAppointment) =>
        this.appointmentDataService.rescheduleAppointment(action.payload).pipe(
          mergeMap(() => [new AppointmentActions.RescheduleAppointmentSuccess(action.payload)]),
          catchError((err: DataServiceError<any>) => of(new AppointmentActions.RescheduleAppointmentFail(err))),
        )
      )
    );

  @Effect()
  rescheduleAppointmentSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(AppointmentActions.RESCHEDULE_APPOINTMENT_SUCCESS),
      switchMap((action: AppointmentActions.RescheduleAppointmentSuccess) => {
        return this.translateService.get(['label.notifyoptions.smsandemail', 
        'label.notifyoptions.email', 'label.notifyoptions.sms']).pipe(
          switchMap((messages) => {
            let timeFormat: string = 'HH:mm';
            let userLocale: string = DEFAULT_LOCALE;

            this.systemInfoSelectors.timeConvention$.subscribe((tc)=> {
              timeFormat = tc === 'AMPM' ? 'hh:mm A' : 'HH:mm';
            }).unsubscribe();

            this.userSelectors.userLocale$.subscribe(ul=> userLocale = ul).unsubscribe();

            let confirmText = '';
            const customer = (action.payload.customers[0]);
            if(customer.email && customer.phone) {
              confirmText = messages['label.notifyoptions.smsandemail']
            }
            else if (customer.email){
              confirmText = messages['label.notifyoptions.email']
            }
            else if(customer.phone) {
              confirmText = messages['label.notifyoptions.sms']
            }

            var successMessage = {
              heading: "heading.reschedule.done",
              subheading: confirmText ? "subheading.reschedule.done" : '',
              fieldListHeading: "label.reschedule.done.modal.fieldsheading",
              dynamicTransKeys: { confirmOptions: confirmText},
              fieldList: [
                {
                  icon: "calendar-light",
                  label: moment(action.payload.start)
                    .locale(userLocale)
                    .format("dddd DD MMMM")
                },
                {
                  icon: "clock",
                  label: `<span>${
                              moment(action.payload.start)
                              .format(timeFormat)}
                            </span>
                            <span>&nbsp;-&nbsp;</span><span>${
                                moment(
                                action.payload.end
                                ).format(timeFormat)}
                            </span>`
                },
                {
                  icon: "home",
                  label: action.payload.branch.name
                }
              ]
            };
            return [new AppointmentActions.UpdateMessageInfo(successMessage)];
          })
        );
      })
    );

  @Effect()
  rescheduleAppointmentFailed$: Observable<Action> = this.actions$
    .pipe(
      ofType(AppointmentActions.RESCHEDULE_APPOINTMENT_FAIL),
      switchMap((action: AppointmentActions.RescheduleAppointmentFail) => {
        return this.translateService.get(['label.appointment.reschedule.fail']).pipe(
          switchMap((messages) => {
            let errorMessage = {
              firstLineName: messages['label.appointment.reschedule.fail'],
              icon: "error"
            };

            if (action.payload["errorCode"] === 'E461') {
              this.errorHandler.showError('appointment_already_used', action.payload);
            }  else {
              this.errorHandler.showError('label.appointment.reschedule.fail', action.payload);
            }

            return [new AppointmentActions.UpdateMessageInfo(errorMessage)];
          })
        );
      }));
}
