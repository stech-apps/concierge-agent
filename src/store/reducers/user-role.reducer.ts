import * as UserRoleActions from '../actions';
import { UserRole } from 'src/models/UserPermissionsEnum';

export const VISIT_USER_ROLE = 'VISIT_USER_ROLE';
export const APPOINTMENT_USER_ROLE = 'APPOINTMENT_USER_ROLE';
export const NO_ROLE = 'NO_ROLE';


export interface IUserRoleState {
  role: UserRole;
  loading: boolean;
  loaded: boolean;
  error: Object;
}

const initialState = {
  data: {
    id: '',
    userName: '',
    firstName: '',
    lastName: '',
    locale: '',
    direction: '',
    fullName: '',
    isAdmin: true
  },
  role: UserRole.None,
  loading: false,
  loaded: false,
  error: null
};

export function reducer(
  state: IUserRoleState = initialState,
  action: UserRoleActions.AllUserRoleActions
): IUserRoleState {
  switch (action.type) {
    case UserRoleActions.FETCH_USER_ROLE_INFO: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case UserRoleActions.FETCH_USER_ROLE_SUCCESS: {
      return {
        ...state,
        role: action.payload,
        loading: false,
        loaded: true,
        error: null
      };
    }
    case UserRoleActions.FETCH_USER_ROLE_FAIL: {
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
