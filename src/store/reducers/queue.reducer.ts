import { UserRole } from './../../models/UserPermissionsEnum';
import { Queue } from './../../models/IQueue';
import * as QueueActions from '../actions';
import { Visit } from '../../models/IVisit';

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
    case QueueActions.UPDATE_QUEUE_INFO: {
      return {
        ...state,
        allQueueSummary: updateQueueInfo(state.allQueueSummary, action.visit, action.isAddedVisit),
        loading: true,
        error: null
      };
    }
    default: {
      return state;
    }
  }

  function updateQueueInfo(queueList: Queue[], visit: Visit, isAddVisit: boolean): Queue[] {
    return queueList;
  }
    
}
