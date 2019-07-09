import { Action } from '@ngrx/store';

export const FETCH_TOAST_STATE = '[Tosat State] FETCH_TOAST_STATE';
export const SET_TOAST_STATE = '[Tosat State] SET_TOAST_STATE';

export class FetchToastStatus implements Action {
    readonly type = FETCH_TOAST_STATE;
  }
export class SetToastStatus implements Action {
    readonly type = SET_TOAST_STATE;
    constructor(public payload: boolean) { }
  }

// Action types
export type AllToastStateActions = FetchToastStatus
  | SetToastStatus