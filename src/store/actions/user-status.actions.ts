import { Action } from '@ngrx/store';
import { IUserStatus } from '../../models/IUserStatus';

// Fetching user info
export const FETCH_USER_STATUS = '[User Status] FETCH_USER_STATUS';
export const FETCH_USER_STATUS_FAIL = '[User Status] FETCH_USER_STATUS_FAIL';
export const FETCH_USER_STATUS_SUCCESS = '[User Status] FETCH_USER_STATUS_SUCCESS';
export const LOG_OUT = '[User Status] LOG_OUT';
export const LOG_OUT_FAIL = '[User Status] LOG_OUT_FAIL';
export const LOG_OUT_SUCCESS = '[User Status] LOG_OUT_SUCCESS';

export class FetchUserStatus implements Action {
  readonly type = FETCH_USER_STATUS;
}

export class FetchUserStatusFail implements Action {
  readonly type = FETCH_USER_STATUS_FAIL;
  constructor(public payload: Object) {}
}

export class FetchUserStatusSuccess implements Action {
  readonly type = FETCH_USER_STATUS_SUCCESS;
  constructor(public payload: IUserStatus) {}
}

export class Logout implements Action {
  readonly type = LOG_OUT;
}

export class LogoutFail implements Action {
  readonly type = LOG_OUT_FAIL;
  constructor(public payload: Object) {}
}

export class LogoutSuccess implements Action {
  readonly type = LOG_OUT_SUCCESS;
  constructor(public payload: IUserStatus) {}
}

// Action types
export type AllUserStatusActions = FetchUserStatus
                        | FetchUserStatusFail
                        | FetchUserStatusSuccess
                        | Logout
                        | LogoutFail
                        | LogoutSuccess;
