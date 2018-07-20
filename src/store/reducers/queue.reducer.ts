import { UserRole } from './../../models/UserPermissionsEnum';
import { IAccount } from './../../models/IAccount';
import * as QueueActions from '../actions';

export interface IQueueState {
  allQueueSummary: any;
  loading: boolean;
  loaded: boolean;
  error: Object;
}

const initialState = {
  allQueueSummary: {},
  loading: false,
  loaded: false,
  error: null
};

export function reducer(
  state: IQueueState = initialState,
  action: QueueActions.AllQueueActions
): IQueueState {
  switch (action.type) {
    case QueueActions.FETCH_QUEUE_INFO_SUCCESS: {
      return {
        ...state,
        allQueueSummary: action.payload,
        loading: true,
        error: null
      };
    }
    case QueueActions.FETCH_QUEUE_INFO_FAIL: {
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
