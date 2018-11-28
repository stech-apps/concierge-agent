import { Action } from '@ngrx/store';
import { ISystemInfo } from '../../models/ISystemInfo';

export const FETCH_SP_SYSTEM_INFO = '[System Info] FETCH_SP_SYSTEM_INFO';
export const FETCH_SP_SYSTEM_INFO_SUCCESS = '[System Info] FETCH_SP_SYSTEM_INFO_SUCCESS';
export const FETCH_SP_SYSTEM_INFO_FAIL = '[System Info] FETCH_SP_SYSTEM_INFO_FAIL';

export class FetchSPSystemInfo implements Action {
    readonly type = FETCH_SP_SYSTEM_INFO;
  }

  export class FetchSPSystemInfoFail implements Action {
    readonly type = FETCH_SP_SYSTEM_INFO_FAIL;
    constructor(public payload: Object) { }
  }

  export class FetchSPSystemInfoSuccess implements Action {
    readonly type = FETCH_SP_SYSTEM_INFO_SUCCESS;
    constructor(public payload: ISystemInfo) { }
  }

  // Action types
export type AllSPSystemInfoActions = FetchSPSystemInfo
| FetchSPSystemInfoFail
| FetchSPSystemInfoSuccess;
