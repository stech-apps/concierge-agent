import { ISystemInfo } from './../../models/ISystemInfo';
import * as SystemInfoActions from '../actions';
import { HttpHeaders } from '@angular/common/http';

export interface ISystemInfoState {
  data: ISystemInfo;
  loading: boolean;
  loaded: boolean;
  error: Object;
  isDistributedAgent: boolean;
  authorizationHeader: HttpHeaders;
}

const initialState = {
  data: {
    productName: '',
    releaseName: '',
    productVersion: '',
    licenseCompanyName: '',
    defaultLanguage: '',
    dateConvention:'',
    protocol: '',
    host: '',
    port: '',
    timeConvention: '24 hour'
  },
  loading: false,
  loaded: false,
  error: null,
  isDistributedAgent: false,
  authorizationHeader: null
};


export function reducer(
  state: ISystemInfoState = initialState,
  action: SystemInfoActions.AllSystemInfoActions
): ISystemInfoState {
  switch (action.type) {
    case SystemInfoActions.FETCH_SYSTEM_INFO: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case SystemInfoActions.FETCH_SYSTEM_INFO_SUCCESS: {
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
    case SystemInfoActions.FETCH_SYSTEM_INFO_FAIL: {

      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
          ...action.payload
        }
      };
    }

    case SystemInfoActions.SET_DISTRIBUTED_AGENT: {
      return {
        ...state,
        isDistributedAgent: true
      };
    }
    case SystemInfoActions.SET_AUTHORIZATION: {
      return {
        ...state,
        authorizationHeader: action.payload
      };
    }
    case SystemInfoActions.RESET_AUTHORIZATION: {
      return {
        ...state,
        authorizationHeader: null
      };
    }

    default: {
      return state;
    }
  }
}
