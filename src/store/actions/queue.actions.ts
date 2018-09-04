import { Action } from '@ngrx/store';
import { Visit } from '../../models/IVisit';
import { IBranch } from '../../models/IBranch';

// Fetching user info
export const FETCH_QUEUE_INFO = '[QUEUE] FETCH_QUEUE_INFO';
export const FETCH_QUEUE_INFO_FAIL = '[QUEUE] FETCH_QUEUE_INFO_FAIL';
export const FETCH_QUEUE_INFO_SUCCESS =  '[QUEUE] FETCH_QUEUE_INFO_SUCCESS';
export const UPDATE_QUEUE_INFO = '[QUEUE] UPDATE_QUEUE_INFO';
export const FETCH_SELECTED_QUEUE_INFO = '[QUEUE] FETCH_SELECTED_QUEUE_INFO';
export const FETCH_SELECTED_QUEUE_INFO_FAIL = '[QUEUE] FETCH_SELECTED_QUEUE_INFO_FAIL';
export const FETCH_SELECTED_QUEUE_INFO_SUCCESS = '[QUEUE] FETCH_SELECTED_QUEUE_INFO_SUCCESS';

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

export class UpdateQueueInfo implements Action {
  readonly type = UPDATE_QUEUE_INFO;
  constructor(public visit: Visit, public isAddedVisit: boolean) {}
}

export class FetchSelectedQueueInfo implements Action {
  readonly type = FETCH_SELECTED_QUEUE_INFO;
  constructor(public branch:number,public searchText:string) {}
}

export class FetchSelectedQueueInfoFail implements Action {
  readonly type = FETCH_SELECTED_QUEUE_INFO_FAIL;
  constructor(public payload: object) {}
}

export class FetchSelectedQueueInfoSuccess implements Action {
  readonly type = FETCH_SELECTED_QUEUE_INFO_SUCCESS;
  constructor(public payload: Visit) {}
}

// Action types
export type AllQueueActions = FetchQueueInfoSuccess
  | FetchQueueInfo
  | FetchQueueInfoFail
  | UpdateQueueInfo
  | FetchSelectedQueueInfo
  | FetchSelectedQueueInfoFail
  | FetchSelectedQueueInfoSuccess

