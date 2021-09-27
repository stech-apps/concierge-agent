import { Action } from '@ngrx/store';
import { IBookingInformation } from '../../models/IBookingInformation';
import { ITimeSlotResponse } from '../../models/ITimeSlotResponse';
import * as moment from 'moment';

export const FETCH_TIMESLOTS = '[Timeslot] FETCH_TIMESLOTS';
export const FETCH_TIMESLOTS_FAIL = '[Timeslot] FETCH_TIMESLOTS_FAIL';
export const FETCH_TIMESLOTS_SUCCESS = '[Timeslot] FETCH_TIMESLOTS_SUCCESS';
export const FETCH_TIMESLOTS_BY_VISITORS = '[Timeslot] FETCH_TIMESLOTS_BY_VISITORS';
export const FETCH_TIMESLOTS_BY_VISITORS_FAIL = '[Timeslot] FETCH_TIMESLOTS_BY_VISITORS_FAIL';
export const FETCH_TIMESLOTS_BY_VISITORS_SUCCESS = '[Timeslot] FETCH_TIMESLOTS_BY_VISITORS_SUCCESS';
export const SELECT_TIMESLOT = '[Timeslot] SELECT_TIMESLOT';
export const SELECT_TIMESLOT_DATE = '[Timeslot] SELECT_TIMESLOT_DATE';
export const DESELECT_TIMESLOT = '[Timeslot] DESELECT_TIMESLOT';
export const RESET_TIMESLOTS = '[Timeslot] RESET_TIMESLOTS';

export class FetchTimeslots implements Action {
  readonly type = FETCH_TIMESLOTS;
  constructor(public payload: IBookingInformation) { }
}

export class FetchTimeslotsFail implements Action {
  readonly type = FETCH_TIMESLOTS_FAIL;
  constructor(public payload: Object) { }
}

export class FetchTimeslotsSuccess implements Action {
  readonly type = FETCH_TIMESLOTS_SUCCESS;
  constructor(public payload: ITimeSlotResponse) { }
}


export class FetchTimeslotsByVisitors implements Action {
  readonly type = FETCH_TIMESLOTS_BY_VISITORS;
  constructor(public payload: IBookingInformation) { }
}

export class FetchTimeslotsByVisitorsFail implements Action {
  readonly type = FETCH_TIMESLOTS_BY_VISITORS_FAIL;
  constructor(public payload: Object) { }
}

export class FetchTimeslotsByVisitorsSuccess implements Action {
  readonly type = FETCH_TIMESLOTS_BY_VISITORS_SUCCESS;
  constructor(public payload: ITimeSlotResponse) { }
}

export class SelectTimeSlotDate implements Action {
  readonly type = SELECT_TIMESLOT_DATE;
  constructor(public payload: moment.Moment) { }
}

export class SelectTimeslot implements Action {
  readonly type = SELECT_TIMESLOT;
  constructor(public payload: string) { }
}

export class DeselectTimeslot implements Action {
  readonly type = DESELECT_TIMESLOT;
}

export class ResetTimeslots implements Action {
  readonly type = RESET_TIMESLOTS;
}

// Action types
export type AllTimeslotActions = FetchTimeslots |
  FetchTimeslotsByVisitors |
  FetchTimeslotsByVisitorsFail |
  FetchTimeslotsByVisitorsSuccess |
  FetchTimeslotsFail |
  FetchTimeslotsSuccess |
  SelectTimeslot |
  DeselectTimeslot |
  SelectTimeSlotDate |
  ResetTimeslots;
