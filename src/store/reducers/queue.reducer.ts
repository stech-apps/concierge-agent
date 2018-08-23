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

  function updateQueueInfo(queueSummary: any, visit: Visit, isAddedVisit: boolean): any {
    if(queueSummary){
    if(queueSummary.queues){
    let queueList : Queue[] = queueSummary.queues;
    let queue = queueList.find(queue => queue.id === visit.queueId);
    let index = queueList.indexOf(queue);
    if(isAddedVisit){
      queue.customers = queue.customers + 1;
      queueSummary.totalCustomersWaiting = queueSummary.totalCustomersWaiting + 1;
      if(queue.waitingTime < visit.waitingTime){
        queue.waitingTime = visit.waitingTime;
      }
      if(queueSummary.maxWaitingTime < visit.waitingTime){
        queueSummary.maxWaitingTime = visit.waitingTime;
      }
    }
    else{
      queue.customers = queue.customers - 1;
      queueSummary.totalCustomersWaiting = queueSummary.totalCustomersWaiting - 1;
    }
    
    queueSummary.queues[index] = queue;
    return queueSummary;
  }
}}
}
