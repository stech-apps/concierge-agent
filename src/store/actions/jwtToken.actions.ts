import { Action } from '@ngrx/store';
import { IJWTToken } from './../../models/IJWTToken';

// Fetching user info
export const FETCH_JWT_TOKEN = '[JWTToken] FETCH_JWT_TOKEN';
export const FETCH_JWT_TOKEN_FAIL = '[JWTToken] FETCH_JWT_TOKEN_FAIL';
export const FETCH_JWT_TOKEN_SUCCESS = '[JWTToken] FETCH_JWT_TOKEN_SUCCESS';

export class FetchJWTToken implements Action {
  readonly type = FETCH_JWT_TOKEN;
}

export class FetchJWTTokenFail implements Action {
  readonly type = FETCH_JWT_TOKEN_FAIL;
  constructor(public payload: Object) {}
}

export class FetchJWTTokenSuccess implements Action {
  readonly type = FETCH_JWT_TOKEN_SUCCESS;
  constructor(public payload: string) {}
}

// Action types
export type AllJWTTokenActions = FetchJWTToken
                        | FetchJWTTokenFail
                        | FetchJWTTokenSuccess;
