import { IJWTToken } from './../../models/IJWTToken';
import * as JWTTokenActions from '../actions';

export interface IJWTTokenState {
    token: string;
    loading: boolean;
    loaded: boolean;
    error: Object;
}

const initialState = {
  token: '',
  loading: false,
  loaded: false,
  error:  null
};


export function reducer(
  state: IJWTTokenState = initialState,
  action: JWTTokenActions.AllJWTTokenActions
): IJWTTokenState {
  switch (action.type) {
    case JWTTokenActions.FETCH_JWT_TOKEN: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case JWTTokenActions.FETCH_JWT_TOKEN_SUCCESS: {
      return {
        ...state,
        token: action.payload,
        loading: false,
        loaded: true,
        error: null
      };
    }
    case JWTTokenActions.FETCH_JWT_TOKEN_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
            ...action.payload
        }
      };
    }
    default: {
        return state;
    }
  }
}
