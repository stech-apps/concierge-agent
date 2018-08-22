import { IServicePointResponse } from './../../models/IServicePointResponse';
import { Action } from '@ngrx/store';
import { IServicePoint } from 'src/models/IServicePoint';


// Fetch service points
export const FETCH_SERVICEPOINTS = '[ServicePoint] FETCH_SERVICEPOINT';
export const FETCH_SERVICEPOINTS_FAIL = '[ServicePoint] FETCH_SERVICEPOINT_FAIL';
export const FETCH_SERVICEPOINTS_SUCCESS = '[ServicePoint] FETCH_SERVICEPOINT_SUCCESS';
export const SET_OPEN_SERVICE_POINT = '[ServicePoint] SET_OPEN_SERVICE_POINT';
export const SET_PREVIOUS_SERVICE_POINT = '[ServicePoint] SET_PREVIOUS_SERVICE_POINT';

export class FetchServicePoints implements Action {
  readonly type = FETCH_SERVICEPOINTS;
  constructor(public branchId: number) {
  }
}

export class FetchServicePointsFail implements Action {
  readonly type = FETCH_SERVICEPOINTS_FAIL;
  constructor(public payload: Object) {}
}

export class FetchServicePointsSuccess implements Action {
  readonly type = FETCH_SERVICEPOINTS_SUCCESS;
  constructor(public payload: IServicePointResponse) {}
}

export class SetOpenServicePoint implements Action {
  readonly type = SET_OPEN_SERVICE_POINT;
  constructor(public servicePoint: IServicePoint) {
  }
}
export class SetPreviousServicePoint implements Action {
  readonly type = SET_PREVIOUS_SERVICE_POINT;
  constructor(public servicePoint: IServicePoint) {
  }
}

// Action types
export type AllServicePointActions = FetchServicePoints
                        | FetchServicePointsFail
                        | FetchServicePointsSuccess
                        | SetOpenServicePoint
                        | SetPreviousServicePoint;