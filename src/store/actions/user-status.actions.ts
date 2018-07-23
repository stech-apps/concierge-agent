import { Action } from '@ngrx/store';
import { IUserStatus } from '../../models/IUserStatus';

// Fetching user info
export const FETCH_USER_STATUS = '[User Status] FETCH_USER_STATUS';
export const FETCH_USER_STATUS_FAIL = '[User Status] FETCH_USER_STATUS_FAIL';
export const FETCH_USER_STATUS_SUCCESS = '[User Status] FETCH_USER_STATUS_SUCCESS';

export const SET_USER_STATUS = '[User Status] SET_USER_STATUS';

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

export class SetUserStatus implements Action {
  readonly type = SET_USER_STATUS;
  constructor(public payload: IUserStatus) {}
}

// Action types
export type AllUserStatusActions = FetchUserStatus
                        | FetchUserStatusFail
                        | FetchUserStatusSuccess
                        | SetUserStatus;
