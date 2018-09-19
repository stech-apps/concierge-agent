import { UserRole } from './../../models/UserPermissionsEnum';
import { IAccount } from './../../models/IAccount';
import * as GlobalNotifyActions from '../actions';

export interface IGlobalNotifyState {
  error: any;
  warning: any;
}

const initialState = {
  error: null,
  warning: null
};

export function reducer(
  state: IGlobalNotifyState = initialState,
  action: GlobalNotifyActions.AllGlobalNotifyActions
): IGlobalNotifyState {
  switch (action.type) {
    case GlobalNotifyActions.GLOBAL_NOTIFY_ERROR: {
      return {
        ...state,
        error: action.payload
      };
    }
    case GlobalNotifyActions.GLOBAL_NOTIFY_WARNING: {
      return {
        ...state,
        warning: action.payload
      };
    }
    case GlobalNotifyActions.GLOBAL_NOTIFY_HIDE: {
      return {
        ...state,
        warning: null,
        error: null
      };
    }
    default: {
      return state;
    }
  }
}
