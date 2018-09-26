import { Action } from '@ngrx/store';
import { ISystemInfo } from './../../models/ISystemInfo';
import { HttpHeaders } from '@angular/common/http';

// Fetching system info
export const FETCH_SYSTEM_INFO = '[System Info] FETCH_SYSTEM_INFO';
export const FETCH_SYSTEM_INFO_FAIL = '[System Info] FETCH_SYSTEM_INFO_FAIL';
export const FETCH_SYSTEM_INFO_SUCCESS = '[System Info] FETCH_SYSTEM_INFO_SUCCESS';
export const SET_DISTRIBUTED_AGENT = '[System Info] SET_DISTRIBUTED_AGENT';

export const SET_AUTHORIZATION = '[System Info] SET_AUTHORIZATION';
export const RESET_AUTHORIZATION = '[System Info] RESET_AUTHORIZATION';

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

export class SetAuthorization implements Action {
  readonly type = SET_AUTHORIZATION;
  constructor(public payload: HttpHeaders) { }
}

export class ResetAuthorization implements Action {
  readonly type = RESET_AUTHORIZATION;
}

// Action types
export type AllSystemInfoActions = FetchSystemInfo
  | FetchSystemInfoFail
  | FetchSystemInfoSuccess
  | SetDistributedAgent
  | SetAuthorization
  | ResetAuthorization;
