import { Action } from '@ngrx/store';
import { IAppointment } from '../../models/IAppointment';
import { IBookingInformation } from '../../models/IBookingInformation';

// Reserve actions
export const RESERVE_APPOINTMENT = '[Reserve] RESERVE_APPOINTMENT';
export const RESERVE_APPOINTMENT_FAIL = '[Reserve] RESERVE_APPOINTMENT_FAIL';
export const RESERVE_APPOINTMENT_SUCCESS = '[Reserve] RESERVE_APPOINTMENT_SUCCESS';

export const FETCH_RESERVABLE_DATES = '[Reserve] FETCH_RESERVABLE_DATES';
export const FETCH_RESERVABLE_DATES_FAIL = '[Reserve] FETCH_RESERVABLE_DATES_FAIL';
export const FETCH_RESERVABLE_DATES_SUCCESS = '[Reserve] FETCH_RESERVABLE_DATES_SUCCESS';

export const UNRESERVE_APPOINTMENT = '[Reserve] UNRESERVE_APPOINTMENT';
export const UNRESERVE_APPOINTMENT_FAIL = '[Reserve] UNRESERVE_APPOINTMENT_FAIL';
export const UNRESERVE_APPOINTMENT_SUCCESS = '[Reserve] UNRESERVE_APPOINTMENT_SUCCESS';

export const RESET_RESERVED_APPOINTMENT = '[Reserve] RESET_RESERVED_APPOINTMENT';


export class ReserveAppointment implements Action {
  readonly type = RESERVE_APPOINTMENT;
  constructor(public payload: { bookingInformation: IBookingInformation, appointment: IAppointment }) {}
}

export class ReserveAppointmentFail implements Action {
  readonly type = RESERVE_APPOINTMENT_FAIL;
  constructor(public payload: any) {}
}

export class ReserveAppointmentSuccess implements Action {
  readonly type = RESERVE_APPOINTMENT_SUCCESS;
  constructor(public payload: IAppointment) {}
}

export class FetchReservableDates implements Action {
  readonly type = FETCH_RESERVABLE_DATES;
  constructor(public payload: IBookingInformation) {}
}

export class FetchReservableDatesFail implements Action {
  readonly type = FETCH_RESERVABLE_DATES_FAIL;
  constructor(public payload: any) {}
}

export class FetchReservableDatesSuccess implements Action {
  readonly type = FETCH_RESERVABLE_DATES_SUCCESS;
  constructor(public payload: any) {}
}

export class UnreserveAppointment implements Action {
  readonly type = UNRESERVE_APPOINTMENT;
  constructor(public payload: IAppointment) {}
}

export class UnreserveAppointmentFail implements Action {
  readonly type = UNRESERVE_APPOINTMENT_FAIL;
  constructor(public payload: Object) {}
}

export class UnreserveAppointmentSuccess implements Action {
  readonly type = UNRESERVE_APPOINTMENT_SUCCESS;
}

export class ResetReservedAppointment implements Action {
  readonly type = RESET_RESERVED_APPOINTMENT;
}

export type AllReserveActions = ReserveAppointment |
                                ReserveAppointmentFail |
                                ReserveAppointmentSuccess |
                                UnreserveAppointment |
                                UnreserveAppointmentFail |
                                UnreserveAppointmentSuccess |
                                ResetReservedAppointment|
                                FetchReservableDates | 
                                FetchReservableDatesSuccess |
                                FetchReservableDatesFail;
