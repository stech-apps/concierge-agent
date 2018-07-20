import { Action } from '@ngrx/store';

// Fetching user info
export const FETCH_QUEUE_INFO = '[QUEUE] FETCH_QUEUE_INFO';
export const FETCH_QUEUE_INFO_FAIL = '[QUEUE] FETCH_QUEUE_INFO_FAIL';
export const FETCH_QUEUE_INFO_SUCCESS =
  '[QUEUE] FETCH_QUEUE_INFO_SUCCESS';

export class FetchQueueInfo implements Action {
  readonly type = FETCH_QUEUE_INFO;
  constructor(public payload: number) {}
}

export class FetchQueueInfoFail implements Action {
  readonly type = FETCH_QUEUE_INFO_FAIL;
  constructor(public payload: Object) {}
}

export class FetchQueueInfoSuccess implements Action {
  readonly type = FETCH_QUEUE_INFO_SUCCESS;
  constructor(public payload: Object) {}
}

// Action types
export type AllQueueActions = FetchQueueInfoSuccess
  | FetchQueueInfo
  | FetchQueueInfoFail;
