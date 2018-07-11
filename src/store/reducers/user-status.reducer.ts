import { IUserStatus } from '../../models/IUserStatus';
import * as UserStatusActions from '../actions/user-status.actions';

export interface IUserStatusState {
    data: IUserStatus;
    loading: boolean;
    loaded: boolean;
    error: Object;
}

const initialState = {
  data: {
    branchId: null,
    userState: null,
    visitState: null,
    servicePointId: null,
    servicePointName: null,
    servicePointState: null,
    //visit: string;
    workProfileId: null,
    workProfileName: null
  },
  loading: false,
  loaded: false,
  error:  null
};


export function reducer(
  state: IUserStatusState = initialState,
  action: UserStatusActions.AllUserStatusActions
): IUserStatusState {
  switch (action.type) {
    case UserStatusActions.FETCH_USER_STATUS: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case UserStatusActions.FETCH_USER_STATUS_SUCCESS: {
      return {
        ...state,
        data: {
            ...state.data,
            ...action.payload
        },
        loading: false,
        loaded: true,
        error: null
      };
    }
    case UserStatusActions.FETCH_USER_STATUS_FAIL: {
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
