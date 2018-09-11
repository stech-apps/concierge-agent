import { UserRole } from './../../models/UserPermissionsEnum';
import { Queue } from './../../models/IQueue';
import * as QueueVisitsActions from '../actions';
import { Visit } from '../../models/IVisit';

export interface IQueueVisitsState {
  queueVisitsList: Visit[];
  loading: boolean;
  loaded: boolean;
  error: Object;
}

const initialState = {
  queueVisitsList : [],
  loading: false,
  loaded: false,
  error: null
};

export function reducer(
  state: IQueueVisitsState = initialState,
  action: QueueVisitsActions.AllQueueVisitActions
): IQueueVisitsState {
  switch (action.type) {
    case QueueVisitsActions.FETCH_QUEUE_VISITS_SUCCESS: {
      return {
        ...state,
        queueVisitsList: action.payload,
        loading: false,
        error: null
      };
    }
    case QueueVisitsActions.FETCH_QUEUE_VISITS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
          ...action.payload
        }
      };
    }
    case QueueVisitsActions.FETCH_QUEUE_VISITS: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    default: {
      return state;
    }
  }
}
