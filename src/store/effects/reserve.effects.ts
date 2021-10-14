
import { GlobalErrorHandler } from './../../util/services/global-error-handler.service';
import { ToastService } from './../../util/services/toast.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Action } from '@ngrx/store/src/models';
import { TranslateService } from '@ngx-translate/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ReserveDataService, DataServiceError } from '../services';
import { switchMap, tap, map, withLatestFrom, mergeMap, catchError } from 'rxjs/operators';
import * as ReserveActions from './../actions';

import * as AllActions from './../actions';

import { IAppState } from '../reducers/index';
import { IAppointment } from '../../models/IAppointment';
import { IService } from '../../models/IService';
import { IBookingInformation } from '../../models/IBookingInformation';
import { BLOCKED_ERROR_CODES, ERROR_CODE_TIMESLOT_TAKEN } from '../../app/shared/error-codes';
import { Observable, of, forkJoin, empty } from 'rxjs';

const toAction = ReserveActions.toAction();

@Injectable()
export class ReserveEffects {
  constructor(
    private store$: Store<IAppState>,
    private actions$: Actions,
    private reserveDataService: ReserveDataService,
    private toastService: ToastService,
    private errorHandler: GlobalErrorHandler,
    private translateService: TranslateService
  ) { }

  @Effect()
  reserveAppointment$: Observable<any> = this.actions$
    .pipe(
      ofType(ReserveActions.RESERVE_APPOINTMENT),
      switchMap((action: AllActions.ReserveAppointment) =>
        toAction(
          this.reserveDataService.reserveAppointment(action.payload.bookingInformation, action.payload.appointment),
          AllActions.ReserveAppointmentSuccess,
          AllActions.ReserveAppointmentFail
        )
      )
    );

  @Effect()
  reserveAppointmentByVisitors$: Observable<any> = this.actions$
    .pipe(
      ofType(ReserveActions.RESERVE_APPOINTMENT_BY_VISTORS),
      switchMap((action: AllActions.ReserveAppointment) =>
        toAction(
          this.reserveDataService.reserveAppointmentByVisitors(action.payload.bookingInformation, action.payload.appointment),
          AllActions.ReserveAppointmentSuccess,
          AllActions.ReserveAppointmentFail
        )
      )
    );

  @Effect()
  fetchReservableDates$: Observable<any> = this.actions$
    .pipe(
      ofType(ReserveActions.FETCH_RESERVABLE_DATES),
      switchMap((action: AllActions.FetchReservableDates) =>
        toAction(
          this.reserveDataService.fetchReservableDates(action.payload),
          AllActions.FetchReservableDatesSuccess,
          AllActions.FetchReservableDatesFail
        )
      )
    );

  @Effect()
  fetchReservableDatesByVisitors$: Observable<any> = this.actions$
    .pipe(
      ofType(ReserveActions.FETCH_RESERVABLE_DATES_BY_VISITORS),
      switchMap((action: AllActions.FetchReservableDatesByVisitors) =>
        toAction(
          this.reserveDataService.fetchReservableDatesByVisitors(action.payload),
          AllActions.FetchReservableDatesByVisitorsSuccess,
          AllActions.FetchReservableDatesByVisitorsFail
        )
      )
    );

  @Effect({ dispatch: false })
  fetchReservableDatesByVisitorsFail$: Observable<Action> = this.actions$
    .pipe(
      ofType(ReserveActions.FETCH_RESERVABLE_DATES_BY_VISITORS_FAIL),
      tap(
        (action: ReserveActions.FetchReservableDatesByVisitorsFail) => {
          if ((action.payload['errorCode'] == BLOCKED_ERROR_CODES.ERROR_CODE_TIME_SLOT)) {
            this.translateService.get('label.error.time.slot.not.allowed').subscribe(
              (label: string) => {
                this.toastService.errorToast(label);
              }
            ).unsubscribe();
        }}
      ),
    );

  @Effect()
  unreserveAppointment$: Observable<Action> = this.actions$
    .pipe(
      ofType(ReserveActions.DESELECT_TIMESLOT),
      withLatestFrom(this.store$.select((state: IAppState) => state.reserved.reservedAppointment)),
      switchMap((data: any) => {
        const [action, reservedAppointment] = data;
        if (reservedAppointment) {
          return toAction(
            this.reserveDataService.unreserveAppointment(reservedAppointment.publicId),
            ReserveActions.UnreserveAppointmentSuccess,
            ReserveActions.UnreserveAppointmentFail
          );
        } else {
          return empty();
        }
      })
    );

  @Effect()
  removerreserveAppointment$: Observable<Action> = this.actions$
    .pipe(
      ofType(ReserveActions.UNRESERVE_APPOINTMENT),
      withLatestFrom(this.store$.select((state: IAppState) => state.reserved.reservedAppointment)),
      switchMap((data: any) => {
        const [action, reservedAppointment] = data;
        if (reservedAppointment) {
          return toAction(
            this.reserveDataService.unreserveAppointment(reservedAppointment.publicId),
            ReserveActions.UnreserveAppointmentSuccess,
            ReserveActions.UnreserveAppointmentFail
          );
        } else {
          return empty();
        }
      })
    );

  @Effect()
  reserveAppointmentFailed$: Observable<Action> = this.actions$
    .pipe(
      ofType(ReserveActions.RESERVE_APPOINTMENT_FAIL),
      tap(
        (action: ReserveActions.ReserveAppointmentFail) => {
          if (action.payload['errorCode'] == "E440") {
            this.errorHandler.showError('time_slot_already_taken', action.payload);
          } else {
            this.errorHandler.showError('error.reserve.appointment.failed', action.payload);
          }
        }
      ),
      switchMap((action: ReserveActions.ReserveAppointmentFail) => {

        const bookingInformation: IBookingInformation = {
          ...action.payload.requestData.bookingInformation
        };

        return [new ReserveActions.DeselectTimeslot, new ReserveActions.FetchTimeslots(bookingInformation)];
      })
    );
}
