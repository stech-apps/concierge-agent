import { Action } from '@ngrx/store';

export const FETCH_AC_TOAST_STATE = '[AutoClose State] FETCH_AC_TOAST_STATE';
export const SET_AC_TOAST_STATE = '[AutoClose State] SET_AC_TOAST_STATE';
export const FETCH_AC_MODAL_STATE = '[AutoClose State] FETCH_AC_MODAL_STATE';
export const SET_AC_MODAL_STATE = '[AutoClose State] SET_AC_MODAL_STATE';

export class FetchAutoCloseToastStatus implements Action {
    readonly type = FETCH_AC_TOAST_STATE;
  }
export class SetAutoCloseToastStatus implements Action {
    readonly type = SET_AC_TOAST_STATE;
    constructor(public payload: boolean) { }
  }

export class FetchAutoCloseModalStatus implements Action {
    readonly type = FETCH_AC_MODAL_STATE;
  }
export class SetAutoCloseModalStatus implements Action {
    readonly type = SET_AC_MODAL_STATE;
    constructor(public payload: boolean) { }
  }

// Action types
export type AllAutoCloseStateActions = FetchAutoCloseToastStatus |
                                   SetAutoCloseToastStatus |
                                   FetchAutoCloseModalStatus |
                                   SetAutoCloseModalStatus;
