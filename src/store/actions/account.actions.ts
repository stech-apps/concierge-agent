import { UserRole } from 'src/models/UserPermissionsEnum';
import { Action } from '@ngrx/store';
import { IAccount } from './../../models/IAccount';

// Fetching user info
export const FETCH_ACCOUNT_INFO = '[Account] FETCH_ACCOUNT_INFO';
export const FETCH_ACCOUNT_INFO_FAIL = '[Account] FETCH_ACCOUNT_INFO_FAIL';
export const FETCH_ACCOUNT_INFO_SUCCESS =
  '[Account] FETCH_ACCOUNT_INFO_SUCCESS';

export const MENU_ITEM_DESELECT = '[Account] MENU_ITEM_DESELECT'

export const SET_USE_DEFAULT_STATUS = '[Account] SET_USE_DEFAULT_STATUS';

export class FetchAccountInfo implements Action {
  readonly type = FETCH_ACCOUNT_INFO;
}

export class FetchAccountInfoFail implements Action {
  readonly type = FETCH_ACCOUNT_INFO_FAIL;
  constructor(public payload: Object) {}
}

export class FetchAccountInfoSuccess implements Action {
  readonly type = FETCH_ACCOUNT_INFO_SUCCESS;
  constructor(public payload: { data: IAccount; userRole: UserRole }) {}
}

export class SetUseDefaultStatus implements Action {
  readonly type = SET_USE_DEFAULT_STATUS;
  constructor(public payload: boolean) {}
}

export class MenuItemDeselect implements Action {
  readonly type = MENU_ITEM_DESELECT;
  constructor(public payload: boolean) {}
}

// Action types
export type AllAccountActions =
  | FetchAccountInfo
  | FetchAccountInfoFail
  | FetchAccountInfoSuccess
  | SetUseDefaultStatus
  |MenuItemDeselect;
