import { ISystemInfo } from './../../models/ISystemInfo';
import * as SystemInfoActions from '../actions';

export interface ISystemInfoState {
  data: ISystemInfo;
  loading: boolean;
  loaded: boolean;
  error: Object;
  isDistributedAgent: boolean;
}

const initialState = {
  data: {
    productName: '',
    releaseName: '',
    productVersion: '',
    licenseCompanyName: '',
    defaultLanguage: '',
    protocol: '',
    host: '',
    port: ''
  },
  loading: false,
  loaded: false,
  error: null,
  isDistributedAgent: false
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

    default: {
      return state;
    }
  }
}
