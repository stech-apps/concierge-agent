import { Action } from '@ngrx/store';

// Fetching user info
export const SEARCH_APPOINTMENTS = '[Appointment] SEARCH_APPOINTMENTS';
export const SEARCH_CALENDAR_APPOINTMENTS = '[Appointment] SEARCH_CALENDAR_APPOINTMENTS';
export const SEARCH_APPOINTMENTS_FAIL = '[Appointment] SEARCH_APPOINTMENTS_FAIL';
export const SEARCH_APPOINTMENTS_SUCCESS = '[Appointment] SEARCH_APPOINTMENTS_INFO_SUCCESS';
export const SEARCH_CALENDAR_APPOINTMENTS_FAIL = '[Appointment] SEARCH_CALENDAR_APPOINTMENTS_FAIL';
export const SEARCH_CALENDAR_APPOINTMENTS_SUCCESS = '[Appointment] SEARCH_CALENDAR_APPOINTMENTS_SUCCESS';


export class SearchAppointments implements Action {
  readonly type = SEARCH_APPOINTMENTS;
  constructor(public payload: any) {}
}

export class SearchCalendarAppointments implements Action {
  readonly type = SEARCH_CALENDAR_APPOINTMENTS;
  constructor(public payload: any) {}
}


export class SearchAppointmentsFail implements Action {
  readonly type = SEARCH_APPOINTMENTS_FAIL;
  constructor(public payload: any) {}
}

export class SearchAppointmentsSuccess implements Action {
  readonly type = SEARCH_APPOINTMENTS_SUCCESS;
  constructor(public payload: any) {}
}

export class SearchCalendarAppointmentsFail implements Action {
  readonly type = SEARCH_CALENDAR_APPOINTMENTS_FAIL;
  constructor(public payload: any) {}
}

export class SearchCalendarAppointmentsSuccess implements Action {
  readonly type = SEARCH_CALENDAR_APPOINTMENTS_SUCCESS;
  constructor(public payload: any) {}
}

// Action types
export type AllAppointmentActions =
  | SearchAppointments
  | SearchCalendarAppointments
  | SearchAppointmentsSuccess
  | SearchCalendarAppointmentsSuccess
  | SearchAppointmentsFail
  | SearchCalendarAppointmentsFail;
