import { Action } from '@ngrx/store';
import { IServicePointPool } from '../../models/IServicePointPool';


// Fetching user info
export const FETCH_SERVICE_POINT_POOL_INFO = '[QUEUE] FETCH_SERVICE_POINT_POOL_INFO';
export const FETCH_SERVICE_POINT_POOL_INFO_FAIL = '[QUEUE] FETCH_SERVICE_POINT_POOL_INFO_FAIL';
export const FETCH_SERVICE_POINT_POOL_INFO_SUCCESS =  '[QUEUE] FETCH_SERVICE_POINT_POOL_INFO_SUCCESS'

export class FetchServicePointInfo implements Action {
    readonly type = FETCH_SERVICE_POINT_POOL_INFO;
    constructor(public payload: number) {}
  }
  
export class FetchServicePointInfoFail implements Action {
    readonly type = FETCH_SERVICE_POINT_POOL_INFO_FAIL;
    constructor(public payload: object) {}
  }

export class FetchServicePointInfoSucess implements Action {
    readonly type = FETCH_SERVICE_POINT_POOL_INFO_SUCCESS;
    constructor(public payload: IServicePointPool[]) {}
  }
  
  export type AllServicePointPoolActions = FetchServicePointInfo |
                                    FetchServicePointInfoFail|
                                    FetchServicePointInfoSucess