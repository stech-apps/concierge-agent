import { Action } from '@ngrx/store';
import { ISystemInfo } from '../../models/ISystemInfo';

export const FETCH_CALENDAR_SYSTEM_INFO = '[System Info] FETCH_CALENDAR_SYSTEM_INFO';
export const FETCH_CALENDAR_SYSTEM_INFO_SUCCESS = '[System Info] FETCH_CALENDAR_SYSTEM_INFO_SUCCESS';
export const FETCH_CALENDAR_SYSTEM_INFO_FAIL = '[System Info] FETCH_CALENDAR_SYSTEM_INFO_FAIL';

export class FetchCalendarSystemInfo implements Action {
    readonly type = FETCH_CALENDAR_SYSTEM_INFO;
  }

  export class FetchCalendarSystemInfoFail implements Action {
    readonly type = FETCH_CALENDAR_SYSTEM_INFO_FAIL;
    constructor(public payload: Object) { }
  }

  export class FetchCalendarSystemInfoSuccess implements Action {
    readonly type = FETCH_CALENDAR_SYSTEM_INFO_SUCCESS;
    constructor(public payload: ISystemInfo) { }
  }

  // Action types
export type AllCalendarSystemInfoActions = FetchCalendarSystemInfo
| FetchCalendarSystemInfoFail
| FetchCalendarSystemInfoSuccess;
