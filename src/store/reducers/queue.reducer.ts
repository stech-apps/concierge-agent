import { UserRole } from './../../models/UserPermissionsEnum';
import { Queue } from './../../models/IQueue';
import * as QueueActions from '../actions';
import { Visit } from '../../models/IVisit';
import { FetchSelectedVisitInfo, FetchSelectedVisitInfoSuccess } from '../actions';

export interface IQueueState {
  allQueueSummary: any;
  loading: boolean;
  loaded: boolean;
  error: Object;
  selectedVisit:Visit;
  selectedQueue:Queue;
}

const initialState = {
  allQueueSummary: {},
  loading: false,
  loaded: false,
  error: null,
  selectedVisit:null,
  selectedQueue:null
};

export function reducer(
  state: IQueueState = initialState,
  action: QueueActions.AllQueueActions
): IQueueState {
  switch (action.type) {
    case QueueActions.FETCH_QUEUE_INFO_SUCCESS: {
      return {
        ...state,
        allQueueSummary: processQueueInfo(action.payload),
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
        allQueueSummary: processQueueInfo(action.payload),
        loading: true,
        error: null
      };
    }
    case QueueActions.FETCH_SELECTED_VISIT_INFO_SUCCESS: {
      return {
        ...state,
        selectedVisit: action.payload[0],
        error: null
      };
    }

    case QueueActions.FETCH_SELECTED_VISIT_INFO_FAIL: {
      return {
        ...state,
        error: action.payload
      };
    }

    case QueueActions.SELECT_QUEUE: {
      return {
        ...state,
        selectedQueue:action.payload
      };
    }

    case QueueActions.RESET_SELECTED_QUEUE: {
      return {
        ...state,
        selectedQueue:null
      };
    }
    
    case QueueActions.SELECT_VISIT: {
      return {
        ...state,
        selectedVisit: action.payload,
        loading: true,
        error: null
      };
    }

    default: {
      return state;
    }
  }

  function processEstWaitingTime(time) {
    var tmp = time
    var bounds = {upper: undefined, lower: undefined, single: undefined};
    var counter = 0;
    var factor = 5	

    if (tmp < 5) {
        bounds.single = "< 5";
        return bounds.single;
    }

    while (tmp % factor > 0) {
        counter++;
        tmp--;
    }

 //handle cases dividable by 5
    if (counter === 0 && tmp % factor === 0) {
        bounds.lower = tmp;
        bounds.upper = tmp+factor;
        return bounds.lower + "-" + bounds.upper;
    }

    bounds.lower = tmp;
    tmp = time
    while (tmp % factor > 0) {
        tmp++;
    }

    bounds.upper = tmp;
    return bounds.lower + "-" + bounds.upper;
}


  function processQueueInfo(queueInfo) {
    var data = { queues: null, totalCustomersWaiting: null, maxWaitingTime: null }
    var queueInformation = [];
    var customerCount = 0;
    var est_w_time = undefined;
    var maxWT = 0;
    for (var i = 0; i < queueInfo.length; i++) {
      customerCount = customerCount + queueInfo[i].customersWaiting;
      est_w_time = (queueInfo[i].estimatedWaitingTime === -1) ? "-" : processEstWaitingTime(
        Math.round(queueInfo[i].estimatedWaitingTime / 60));
      queueInformation.push({
        queue: queueInfo[i].name,
        customers: queueInfo[i].customersWaiting,
        max_w_time: Math.round(queueInfo[i].waitingTime / 60) == 0 ? "-" : Math.round(queueInfo[i].waitingTime / 60),
        est_w_time: est_w_time,
        waitingTime: queueInfo[i].waitingTime,
        serviceLevel: queueInfo[i].serviceLevel,
        id: queueInfo[i].id

      });

      var tmpMaxWT = Math.round(queueInfo[i].waitingTime / 60);
      if (tmpMaxWT > maxWT) {
        maxWT = Math.round(queueInfo[i].waitingTime / 60);
      }
    }

    data.queues = queueInformation
    data.totalCustomersWaiting = customerCount;
    data.maxWaitingTime = maxWT;
    return data;
  }
}
