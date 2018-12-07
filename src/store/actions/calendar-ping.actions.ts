import { Action } from '@ngrx/store';
import { ISystemInfo } from '../../models/ISystemInfo';

export const FETCH_CALENDAR_PING_INFO = '[Calendar Ping] FETCH_CALENDAR_PING';
export const FETCH_CALENDAR_PING_INFO_SUCCESS = '[Calendar Ping] FETCH_CALENDAR_PING_SUCCESS';
export const FETCH_CALENDAR_PING_INFO_FAIL = '[Calendar Ping] FETCH_CALENDAR_PING_FAIL';

export class FetchCalendarPing implements Action {
    readonly type = FETCH_CALENDAR_PING_INFO;
  }

  export class FetchCalendarPingFail implements Action {
    readonly type = FETCH_CALENDAR_PING_INFO_FAIL;
    constructor(public payload: Object) { }
  }

  export class FetchCalendarPingSuccess implements Action {
    readonly type = FETCH_CALENDAR_PING_INFO_SUCCESS;
    constructor(public payload: Object) { }
  }

  // Action types
export type AllCalendarPingInfoActions = FetchCalendarPing
| FetchCalendarPingFail
| FetchCalendarPingSuccess;
