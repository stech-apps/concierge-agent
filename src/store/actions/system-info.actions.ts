import { Action } from '@ngrx/store';
import { ISystemInfo } from './../../models/ISystemInfo';

// Fetching system info
export const FETCH_SYSTEM_INFO = '[System Info] FETCH_SYSTEM_INFO';
export const FETCH_SYSTEM_INFO_FAIL = '[System Info] FETCH_SYSTEM_INFO_FAIL';
export const FETCH_SYSTEM_INFO_SUCCESS = '[System Info] FETCH_SYSTEM_INFO_SUCCESS';
export const SET_DISTRIBUTED_AGENT = '[System Info] SET_DISTRIBUTED_AGENT';


export class FetchSystemInfo implements Action {
  readonly type = FETCH_SYSTEM_INFO;
}

export class FetchSystemInfoFail implements Action {
  readonly type = FETCH_SYSTEM_INFO_FAIL;
  constructor(public payload: Object) { }
}

export class FetchSystemInfoSuccess implements Action {
  readonly type = FETCH_SYSTEM_INFO_SUCCESS;
  constructor(public payload: ISystemInfo) { }
}

export class SetDistributedAgent implements Action {
  readonly type = SET_DISTRIBUTED_AGENT;

}

// Action types
export type AllSystemInfoActions = FetchSystemInfo
  | FetchSystemInfoFail
  | FetchSystemInfoSuccess
  | SetDistributedAgent;
