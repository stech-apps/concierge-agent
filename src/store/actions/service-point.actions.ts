import { IServicePointResponse } from './../../models/IServicePointResponse';
import { Action } from '@ngrx/store';
import { IServicePoint } from 'src/models/IServicePoint';


// Fetch service points
export const FETCH_SERVICEPOINTS = '[ServicePoint] FETCH_SERVICEPOINT';
export const FETCH__SERVICEPOINTS_FAIL = '[ServicePoint] FETCH__SERVICEPOINT_FAIL';
export const FETCH__SERVICEPOINTS_SUCCESS = '[ServicePoint] FETCH__SERVICEPOINT_SUCCESS';
export const SET_OPEN_SERVICE_POINT = '[ServicePoint] SET_OPEN_SERVICE_POINT';

export class FetchServicePoints implements Action {
  readonly type = FETCH_SERVICEPOINTS;
  constructor(public branchId: number) {
  }
}

export class FetchServicePointsFail implements Action {
  readonly type = FETCH__SERVICEPOINTS_FAIL;
  constructor(public payload: Object) {}
}

export class FetchServicePointsSuccess implements Action {
  readonly type = FETCH__SERVICEPOINTS_SUCCESS;
  constructor(public payload: IServicePointResponse) {}
}

export class SetOpenServicePoint implements Action {
  readonly type = SET_OPEN_SERVICE_POINT;
  constructor(public servicePoint: IServicePoint) {
  }
}

// Action types
export type AllServicePointActions = FetchServicePoints
                        | FetchServicePointsFail
                        | FetchServicePointsSuccess
                        | SetOpenServicePoint;
