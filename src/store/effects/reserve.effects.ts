
import { GlobalErrorHandler } from './../../util/services/global-error-handler.service';
import { ToastService } from './../../util/services/toast.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Action } from '@ngrx/store/src/models';
import { TranslateService } from '@ngx-translate/core';
import { Effect, Actions } from '@ngrx/effects';
import { ReserveDataService, DataServiceError } from '../services';
import { switchMap, tap, map, withLatestFrom, mergeMap, catchError } from 'rxjs/operators';
import * as ReserveActions from './../actions';

import * as AllActions from './../actions';

import { IAppState } from '../reducers/index';
import { IAppointment } from '../../models/IAppointment';
import { IService } from '../../models/IService';
import { IBookingInformation } from '../../models/IBookingInformation';
import { ERROR_CODE_TIMESLOT_TAKEN } from '../../app/shared/error-codes';
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
  .ofType(ReserveActions.RESERVE_APPOINTMENT)
    .pipe(
      switchMap((action: AllActions.ReserveAppointment) =>
        toAction(
          this.reserveDataService.reserveAppointment(action.payload.bookingInformation, action.payload.appointment),
          AllActions.ReserveAppointmentSuccess,
          AllActions.ReserveAppointmentFail
        )
      )
    );

    @Effect()
    fetchReservableDates$: Observable<any> = this.actions$
    .ofType(ReserveActions.FETCH_RESERVABLE_DATES)
      .pipe(
        switchMap((action: AllActions.FetchReservableDates) =>
          toAction(
            this.reserveDataService.fetchReservableDates(action.payload),
            AllActions.FetchReservableDatesSuccess,
            AllActions.FetchReservableDatesFail
          )
        )
      );

  @Effect()
  unreserveAppointment$: Observable<Action> = this.actions$
    .ofType(ReserveActions.DESELECT_TIMESLOT)
    .pipe(
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
    .ofType(ReserveActions.RESERVE_APPOINTMENT_FAIL)
    .pipe(
    tap(
      (action: ReserveActions.ReserveAppointmentFail) => {
        if (action.payload.errorCode === ERROR_CODE_TIMESLOT_TAKEN) {
          this.translateService.get('time_slot_already_taken').subscribe(
            (label: string) => {
              this.toastService.errorToast(label);
            }
          ).unsubscribe();
        } else {
          this.errorHandler.showError('error.reserve.appointment.failed', action.payload);
        }
      }
    ),
    switchMap((action: ReserveActions.ReserveAppointmentFail) => {
      const serviceQuery = action.payload.appointment.services.reduce((queryString, service: IService) => {
        return queryString + `;servicePublicId=${service.id}`;
      }, '');

      const bookingInformation: IBookingInformation = {
        ...action.payload.bookingInformation,
        serviceQuery
      };

      return [new ReserveActions.DeselectTimeslot, new ReserveActions.FetchTimeslots(bookingInformation)];
    })
    );
}
