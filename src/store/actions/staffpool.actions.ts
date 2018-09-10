import { Action } from '@ngrx/store';
import { IStaffPool } from './../../models/IStaffPool';

export const FETCH_STAFF_POOL = '[IStaffPool] FETCH_STAFF_POOL';
export const FETCH_FETCH_STAFF_POOL_FAIL = '[IStaffPool] FETCH_STAFF_POOL_FAIL';
export const FETCH_STAFF_POOL_SUCCESS = '[IStaffPool] FETCH_STAFF_POOL_SUCCESS';

export class FetchStaffPool implements Action {
  constructor(public payload: number) {}
    readonly type = FETCH_STAFF_POOL;
  }

export class FetchStaffPoolFail implements Action {
    readonly type = FETCH_FETCH_STAFF_POOL_FAIL;
    constructor(public payload: Object) {}
  }
export class FetchStaffPoolSuccess implements Action {
    readonly type = FETCH_STAFF_POOL_SUCCESS;
    constructor(public payload: IStaffPool[]) {}
  }

  export type AllStaffPoolActions = FetchStaffPool |
                                    FetchStaffPoolFail |
                                    FetchStaffPoolSuccess