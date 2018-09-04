import { IAppointment } from 'src/models/IAppointment';
import { Action } from '@ngrx/store';

// Fetching user info
export const SEARCH_APPOINTMENTS = '[Appointment] SEARCH_APPOINTMENTS';
export const SEARCH_CALENDAR_APPOINTMENTS = '[Appointment] SEARCH_CALENDAR_APPOINTMENTS';
export const SEARCH_APPOINTMENTS_FAIL = '[Appointment] SEARCH_APPOINTMENTS_FAIL';
export const SEARCH_APPOINTMENTS_SUCCESS = '[Appointment] SEARCH_APPOINTMENTS_INFO_SUCCESS';
export const SEARCH_CALENDAR_APPOINTMENTS_FAIL = '[Appointment] SEARCH_CALENDAR_APPOINTMENTS_FAIL';
export const SEARCH_CALENDAR_APPOINTMENTS_SUCCESS = '[Appointment] SEARCH_CALENDAR_APPOINTMENTS_SUCCESS';
export const DELETE_APPOINTMENT = '[Appointment] DELETE_APPOINTMENT';
export const DELETE_APPOINTMENT_FAIL = '[Appointment] DELETE_APPOINTMENT_FAIL';
export const DELETE_APPOINTMENT_SUCCESS = '[Appointment] DELETE_APPOINTMENT_SUCCESS';


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

export class DeleteAppointment implements Action {
  readonly type = DELETE_APPOINTMENT;
  constructor(public payload: IAppointment, public succssCallBack: any) {}
}

export class DeleteAppointmentFail implements Action {
  readonly type = DELETE_APPOINTMENT_FAIL;
  constructor(public payload: Object) {}
}

export class DeleteAppointmentSuccess implements Action {
  readonly type = DELETE_APPOINTMENT_SUCCESS;
  constructor(public payload: IAppointment, public succssCallBack: any) {}
}

// Action types
export type AllAppointmentActions =
  | SearchAppointments
  | SearchCalendarAppointments
  | SearchAppointmentsSuccess
  | SearchCalendarAppointmentsSuccess
  | SearchAppointmentsFail
  | DeleteAppointment 
  | DeleteAppointmentFail 
  | DeleteAppointmentSuccess 
  | SearchCalendarAppointmentsFail;
