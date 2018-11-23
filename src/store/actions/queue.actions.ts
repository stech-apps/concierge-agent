import { Action } from '@ngrx/store';
import { Visit } from '../../models/IVisit';
import { IBranch } from '../../models/IBranch';
import { Queue } from '../../models/IQueue';

// Fetching user info
export const FETCH_QUEUE_INFO = '[QUEUE] FETCH_QUEUE_INFO';
export const FETCH_QUEUE_INFO_FAIL = '[QUEUE] FETCH_QUEUE_INFO_FAIL';
export const FETCH_QUEUE_INFO_SUCCESS =  '[QUEUE] FETCH_QUEUE_INFO_SUCCESS';
export const UPDATE_QUEUE_INFO = '[QUEUE] UPDATE_QUEUE_INFO';
export const FETCH_SELECTED_VISIT_INFO = '[QUEUE] FETCH_SELECTED_VISIT_INFO';
export const FETCH_SELECTED_VISIT_INFO_FAIL = '[QUEUE] FETCH_SELECTED_VISIT_INFO_FAIL';
export const FETCH_SELECTED_VISIT_INFO_SUCCESS = '[QUEUE] FETCH_SELECTED_VISIT_INFO_SUCCESS';
export const SELECT_QUEUE = '[QUEUE] SELECT_QUEUE';
export const RESET_SELECTED_QUEUE = '[QUEUE] RESET_SELECTED_QUEUE';
export const SELECT_VISIT = '[QUEUE] SELECT_VISIT';
export const RESET_QUEUE_INFO = '[QUEUE] RESET_QUEUE_INFO';
export const RESET_ERROR = '[QUEUE] RESET_ERROR';
export const RESET_FETCH_VISIT_ERROR = '[QUEUE] RESET_FETCH_VISIT_ERROR'
export const SELECT_QUEUE_NAME = '[QUEUE] SELECT_QUEUE_NAME'
export const RESET_QUEUE_NAME = '[QUEUE] RESET_QUEUE_NAME'

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
  constructor(public payload: Queue) {}
}

export class FetchSelectedVisitInfo implements Action {
  readonly type = FETCH_SELECTED_VISIT_INFO;
  constructor(public branch:number,public searchText:string) {}
}

export class FetchSelectedVisitInfoFail implements Action {
  readonly type = FETCH_SELECTED_VISIT_INFO_FAIL;
  constructor(public payload: object) {}
}

export class FetchSelectedVisitInfoSuccess implements Action {
  readonly type = FETCH_SELECTED_VISIT_INFO_SUCCESS;
  constructor(public payload: Visit) {}
}

export class SelectQueue implements Action {
  readonly type = SELECT_QUEUE;
  constructor(public payload: Queue) {}
}

export class ResetSelectedQueue implements Action {
  readonly type = RESET_SELECTED_QUEUE;
  constructor() {}
}


export class SelectVisit implements Action {
  readonly type = SELECT_VISIT;
  constructor(public payload: Visit) {}
}

export class SelectQueueName implements Action {
  readonly type = SELECT_QUEUE_NAME;
  constructor(public payload: string) {}
}
export class ResetQueueName implements Action {
  readonly type = RESET_QUEUE_NAME;
  constructor() {}
}



export class ResetQueueInfo implements Action {
  readonly type = RESET_QUEUE_INFO;
  constructor() {}
}

export class ResetError implements Action {
  readonly type = RESET_ERROR;
  constructor() {}
}

export class ResetFetchVisitError implements Action {
  readonly type = RESET_FETCH_VISIT_ERROR;
  constructor() {}
}


// Action types
export type AllQueueActions = FetchQueueInfoSuccess
  | FetchQueueInfo
  | FetchQueueInfoFail
  | UpdateQueueInfo
  | FetchSelectedVisitInfo
  | FetchSelectedVisitInfoFail
  | FetchSelectedVisitInfoSuccess
  | SelectQueue
  | ResetSelectedQueue
  | SelectVisit
  | ResetQueueInfo
  | ResetError
  | ResetFetchVisitError
  | SelectQueueName
  | ResetQueueName

