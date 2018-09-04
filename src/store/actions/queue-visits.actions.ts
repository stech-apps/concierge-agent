import { Action } from '@ngrx/store';
import { Visit } from '../../models/IVisit';

// Fetching queue visits info
export const FETCH_QUEUE_VISITS = '[QUEUE_VISITS] FETCH_QUEUE_VISITS';
export const FETCH_QUEUE_VISITS_FAIL = '[QUEUE_VISITS] FETCH_QUEUE_VISITS_FAIL';
export const FETCH_QUEUE_VISITS_SUCCESS =
  '[QUEUE_VISITS] FETCH_QUEUE_VISITS_SUCCESS';


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
  constructor(public payload: Object) { }
}



// Action types
export type AllQueueVisitActions = FetchQueueVisits
  | FetchQueueVisitsSuccess
  | FetchQueueVisitsFail;

