import { Action } from '@ngrx/store';
import { Visit } from '../../models/IVisit';

// Fetching queue visits info
export const FETCH_QUEUE_VISITS = '[QUEUE_VISITS] FETCH_QUEUE_VISITS';
export const FETCH_QUEUE_VISITS_FAIL = '[QUEUE_VISITS] FETCH_QUEUE_VISITS_FAIL';
export const FETCH_QUEUE_VISITS_SUCCESS =
  '[QUEUE_VISITS] FETCH_QUEUE_VISITS_SUCCESS';
export const FETCH_QUEUE_VISITS_LOADED_RESET = '[QUEUE_VISITS] FETCH_QUEUE_VISITS_LOADED_RESET';
export const UPDATE_QUEUE_VISITS = '[QUEUE_VISITS] UPDATE_QUEUE_VISITS';


export class FetchQueueVisits implements Action {
  readonly type = FETCH_QUEUE_VISITS;
  constructor(public branchId: number,public queueId:number) { }
}

export class FetchQueueVisitsFail implements Action {
  readonly type = FETCH_QUEUE_VISITS_FAIL;
  constructor(public payload: Object) { }
}

export class FetchQueueVisitsSuccess implements Action {
  readonly type = FETCH_QUEUE_VISITS_SUCCESS;
  constructor(public payload: Visit[]) { }
}

export class FetchQueueVisitsLoadedReset implements Action {
  readonly type = FETCH_QUEUE_VISITS_LOADED_RESET;
  constructor() { }
}

export class UpdateQueueVisits implements Action {
  readonly type = UPDATE_QUEUE_VISITS;
  constructor(public payload: Visit[]) { }
}


// Action types
export type AllQueueVisitActions = FetchQueueVisits
  | FetchQueueVisitsSuccess
  | FetchQueueVisitsFail
  | UpdateQueueVisits
  | FetchQueueVisitsLoadedReset;

