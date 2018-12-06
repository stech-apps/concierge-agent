import { UserRole } from './../../models/UserPermissionsEnum';
import { Queue } from './../../models/IQueue';
import * as QueueActions from '../actions';
import { Visit } from '../../models/IVisit';
import { FetchSelectedVisitInfo, FetchSelectedVisitInfoSuccess } from '../actions';

export interface IQueueState {
  allQueueSummary: any;
  loading: boolean;
  loaded: boolean;
  queueVisitIDloading:boolean;
  queueVisitIDloaded:boolean;
  error: Object;
  selectedVisit: Visit;
  selectedQueue: Queue;
  queueFetchFailCount: number;
  FetchVisitError:Object;
  queueName:string;
}

const initialState = {
  allQueueSummary: {},
  loading: false,
  loaded: false,
  error: null,
  selectedVisit: null,
  queueFetchFailCount: 0,
  selectedQueue: null,
  FetchVisitError:null,
  queueName:null,
  queueVisitIDloading:null,
  queueVisitIDloaded:null
};

export function reducer(
  state: IQueueState = initialState,
  action: QueueActions.AllQueueActions
): IQueueState {
  switch (action.type) {
    case QueueActions.FETCH_QUEUE_INFO_SUCCESS: {
      return {
        ...state,
        queueFetchFailCount: 0,
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
        queueFetchFailCount: state.queueFetchFailCount + 1,
        error: {
          ...action.payload
        }
      };
    }
    case QueueActions.UPDATE_QUEUE_INFO: {
      return {
        ...state,
        queueFetchFailCount: 0,
        allQueueSummary: processQueueInfo(updateQueueList(state.allQueueSummary, action.payload)),
        loading: true,
        error: null
      };
    }
    case QueueActions.FETCH_SELECTED_VISIT_INFO: {
      return {
        ...state,
        queueVisitIDloading: true,
        queueVisitIDloaded: false,
        error: null
      };
    }
    case QueueActions.FETCH_SELECTED_VISIT_INFO_SUCCESS: {
      return {
        ...state,
        queueVisitIDloading: false,
        queueVisitIDloaded: true,
        selectedVisit: action.payload[0],
        error: action.payload[0] ? null : "error",
        FetchVisitError: action.payload[0] ? null : "error"
      };
    }

    case QueueActions.FETCH_SELECTED_VISIT_INFO_FAIL: {
      return {
        ...state,
        queueVisitIDloading: false,
        queueVisitIDloaded: true,
        error: action.payload,
        FetchVisitError:action.payload
      };
    }

    case QueueActions.SELECT_QUEUE: {
      return {
        ...state,
        selectedQueue: action.payload
      };
    }

    case QueueActions.RESET_SELECTED_QUEUE: {
      return {
        ...state,
        selectedQueue: null
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
    case QueueActions.RESET_QUEUE_INFO: {
      return {
        ...state,
        allQueueSummary: {},
        loading: false,
        error: null
      };
    }
    case QueueActions.RESET_ERROR: {
      return {
        ...state,
        error: null
      };
    }
    case QueueActions.RESET_FETCH_VISIT_ERROR: {
      return {
        ...state,
        FetchVisitError: null
      };
    }
    case QueueActions.SELECT_QUEUE_NAME: {
      return {
        ...state,
        queueName:action.payload
      };
    }
    case QueueActions.RESET_QUEUE_NAME: {
      return {
        ...state,
        queueName:null
      };
    }

    default: {
      return state;
    }
  }

  function processEstWaitingTime(time) {
    var tmp = time
    var bounds = { upper: undefined, lower: undefined, single: undefined };
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
      bounds.upper = tmp + factor;
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

  function updateQueueList(queueList: any, queueInfo: Queue) {
    if(queueInfo && queueList.queues){
    var queue = queueList.queues.find(queue => queue.id === queueInfo.id);
    if(queue){
      let index = queueList.queues.indexOf(queue);
      queue.customersWaiting = queueInfo.customersWaiting;
      queue.waitingTime = queueInfo.waitingTime;
      queueList.queues[index] = queue;
    }
    return queueList.queues;
  }
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
        name: queueInfo[i].name,
        customersWaiting: queueInfo[i].customersWaiting,
        max_w_time: Math.round(queueInfo[i].waitingTime / 60) == 0 ? "-" : Math.round(queueInfo[i].waitingTime / 60),
        est_w_time: est_w_time,
        queueType: queueInfo[i].queueType,
        waitingTime: queueInfo[i].waitingTime,
        serviceLevel: queueInfo[i].serviceLevel,
        id: queueInfo[i].id,
        estimatedWaitingTime: queueInfo[i].estimatedWaitingTime
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
