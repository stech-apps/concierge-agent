import { Action } from '@ngrx/store';
import { IServicePointPool } from '../../models/IServicePointPool';


// Fetching user info
export const FETCH_SERVICE_POINT_POOL_INFO = '[IServicePointPool] FETCH_SERVICE_POINT_POOL_INFO';
export const FETCH_SERVICE_POINT_POOL_INFO_FAIL = '[IServicePointPool] FETCH_SERVICE_POINT_POOL_INFO_FAIL';
export const FETCH_SERVICE_POINT_POOL_INFO_SUCCESS =  '[IServicePointPool] FETCH_SERVICE_POINT_POOL_INFO_SUCCESS'
export const RESET_SERVICE_POINT_POOL_INFO = '[IServicePointPool] RESET_SERVICE_POINT_POOL_INFO';

export class FetchServicePointInfo implements Action {
  constructor(public payload: number) {} 
  readonly type = FETCH_SERVICE_POINT_POOL_INFO;
  }
  
export class FetchServicePointInfoFail implements Action {
    readonly type = FETCH_SERVICE_POINT_POOL_INFO_FAIL;
    constructor(public payload: object) {}
  }

export class FetchServicePointInfoSucess implements Action {
    readonly type = FETCH_SERVICE_POINT_POOL_INFO_SUCCESS;
    constructor(public payload: IServicePointPool[]) {}
  }

  export class ResetServicePointInfo implements Action {
    readonly type = RESET_SERVICE_POINT_POOL_INFO;
    constructor() {}
  }
  
  
  export type AllServicePointPoolActions = FetchServicePointInfo |
                                    FetchServicePointInfoFail|
                                    FetchServicePointInfoSucess|
                                    ResetServicePointInfo