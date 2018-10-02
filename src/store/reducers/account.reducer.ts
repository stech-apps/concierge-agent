import { UserRole } from './../../models/UserPermissionsEnum';
import { IAccount } from './../../models/IAccount';
import * as AccountActions from '../actions';

export interface IAccountState {
  data: IAccount;
  userRole: UserRole;
  loading: boolean;
  loaded: boolean;
  error: Object;
  useDefaultStatus: boolean;
  menuItemDeselect:boolean;
}

const initialState = {
  data: {
    id: null,
    userName: '',
    firstName: '',
    lastName: '',
    locale: '',
    direction: '',
    status: '',
    fullName: '',
    modules: [],
    
  },
  userRole: UserRole.None,
  loading: false,
  loaded: false,
  error: null,
  useDefaultStatus: false,
  menuItemDeselect:false
};

export function reducer(
  state: IAccountState = initialState,
  action: AccountActions.AllAccountActions
): IAccountState {
  switch (action.type) {
    case AccountActions.FETCH_ACCOUNT_INFO: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case AccountActions.FETCH_ACCOUNT_INFO_SUCCESS: {
      return {
        ...state,
        data: {
          ...action.payload.data
        },
        userRole: action.payload.userRole,
        loading: false,
        loaded: true,
        error: null
      };
    }
    case AccountActions.FETCH_ACCOUNT_INFO_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
          ...action.payload
        }
      };
    }
    case AccountActions.SET_USE_DEFAULT_STATUS: {
      return {
        ...state,
        useDefaultStatus: action.payload
      };
    }
    case AccountActions.MENU_ITEM_DESELECT: {
      return {
        ...state,
        menuItemDeselect: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
