import { Action } from '@ngrx/store';
import { IAppointment } from '../../models/IAppointment';
import { IBookingInformation } from '../../models/IBookingInformation';

// Reserve actions
export const RESERVE_APPOINTMENT = '[Reserve] RESERVE_APPOINTMENT';
export const RESERVE_APPOINTMENT_FAIL = '[Reserve] RESERVE_APPOINTMENT_FAIL';
export const RESERVE_APPOINTMENT_SUCCESS = '[Reserve] RESERVE_APPOINTMENT_SUCCESS';


// Reserve actions
export const RESERVE_APPOINTMENT_BY_VISTORS = '[Reserve] RESERVE_APPOINTMENT_BY_VISTORS';
export const RESERVE_APPOINTMENT_BY_VISTORS_FAIL = '[Reserve] RESERVE_APPOINTMENT_BY_VISTORS_FAIL';
export const RESERVE_APPOINTMENT_BY_VISTORS_SUCCESS = '[Reserve] RESERVE_APPOINTMENT_BY_VISTORS_SUCCESS';

export const FETCH_RESERVABLE_DATES = '[Reserve] FETCH_RESERVABLE_DATES';
export const FETCH_RESERVABLE_DATES_FAIL = '[Reserve] FETCH_RESERVABLE_DATES_FAIL';
export const FETCH_RESERVABLE_DATES_SUCCESS = '[Reserve] FETCH_RESERVABLE_DATES_SUCCESS';

export const FETCH_RESERVABLE_DATES_BY_VISITORS = '[Reserve] FETCH_RESERVABLE_DATES_BY_VISITORS';
export const FETCH_RESERVABLE_DATES_BY_VISITORS_FAIL = '[Reserve] FETCH_RESERVABLE_DATES_BY_VISITORS_FAIL';
export const FETCH_RESERVABLE_DATES_BY_VISITORS_SUCCESS = '[Reserve] FETCH_RESERVABLE_DATES_BY_VISITORS_SUCCESS';

export const UNRESERVE_APPOINTMENT = '[Reserve] UNRESERVE_APPOINTMENT';
export const UNRESERVE_APPOINTMENT_FAIL = '[Reserve] UNRESERVE_APPOINTMENT_FAIL';
export const RESERVE_APPOINTMENT_FAILIURE_REPORT = '[Reserve] RESERVE_APPOINTMENT_FAILIURE_REPORT';
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

export class ReserveAppointmentByVistors implements Action {
  readonly type = RESERVE_APPOINTMENT_BY_VISTORS;
  constructor(public payload: { bookingInformation: IBookingInformation, appointment: IAppointment }) {}
}

export class ReserveAppointmentByVisitorsSuccess implements Action {
  readonly type = RESERVE_APPOINTMENT_BY_VISTORS_SUCCESS;
  constructor(public payload: IAppointment) {}
}

export class ReserveAppointmentByVistorsFail implements Action {
  readonly type = RESERVE_APPOINTMENT_BY_VISTORS_FAIL;
  constructor(public payload: any) {}
}

export class ReserveAppointmentFailureReport implements Action {
  readonly type = RESERVE_APPOINTMENT_FAILIURE_REPORT;
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

export class FetchReservableDatesByVisitors implements Action {
  readonly type = FETCH_RESERVABLE_DATES_BY_VISITORS;
  constructor(public payload: IBookingInformation) {}
}

export class FetchReservableDatesByVisitorsFail implements Action {
  readonly type = FETCH_RESERVABLE_DATES_BY_VISITORS_FAIL;
  constructor(public payload: any) {}
}

export class FetchReservableDatesByVisitorsSuccess implements Action {
  readonly type = FETCH_RESERVABLE_DATES_BY_VISITORS_SUCCESS;
  constructor(public payload: any) {}
}

export class UnreserveAppointment implements Action {
  readonly type = UNRESERVE_APPOINTMENT;
  constructor() {}
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
                                ReserveAppointmentByVistors |
                                ReserveAppointmentByVisitorsSuccess |
                                ReserveAppointmentByVistorsFail |
                                UnreserveAppointment |
                                UnreserveAppointmentFail |
                                UnreserveAppointmentSuccess |
                                ResetReservedAppointment|
                                FetchReservableDatesByVisitors|
                                FetchReservableDatesByVisitorsSuccess|
                                FetchReservableDatesByVisitorsFail|
                                FetchReservableDates | 
                                FetchReservableDatesSuccess |
                                ReserveAppointmentFailureReport |
                                FetchReservableDatesFail;
