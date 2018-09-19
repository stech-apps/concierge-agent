import { Action } from '@ngrx/store';

export const GLOBAL_NOTIFY_ERROR = '[Global] GLOBAL_ERROR_CRITICAL';
export const GLOBAL_NOTIFY_WARNING = '[Global] GLOBAL_NOTIFY_WARNING';
export const GLOBAL_NOTIFY_HIDE = '[Global] GLOBAL_NOTIFY_HIDE';


export class GlobalError implements Action {
  readonly type = GLOBAL_NOTIFY_ERROR;
  constructor(public payload: Object) {}
}

export class GlobalWarning implements Action {
    readonly type = GLOBAL_NOTIFY_WARNING;
    constructor(public payload: Object) {}
}

export class GlobalNotifiyHide implements Action {
  readonly type = GLOBAL_NOTIFY_HIDE;
  constructor() {}
}

// Action types
export type AllGlobalNotifyActions =

  | GlobalError
  | GlobalWarning
  | GlobalNotifiyHide;
