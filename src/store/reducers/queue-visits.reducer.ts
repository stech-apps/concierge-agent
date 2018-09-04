import { UserRole } from './../../models/UserPermissionsEnum';
import { Queue } from './../../models/IQueue';
import * as QueueVisitsActions from '../actions';
import { Visit } from '../../models/IVisit';

export interface IQueueVisitsState {
  queueVisitsList: any;
  loading: boolean;
  loaded: boolean;
  error: Object;
}

const initialState = {
  queueVisitsList: {},
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

  // function updateQueueInfo(queueSummary: any, visit: Visit, isAddedVisit: boolean): any {
  //   if(queueSummary){
  //   if(queueSummary.queues){
  //   let queueList : Queue[] = queueSummary.queues;
  //   let queue = queueList.find(queue => queue.id === visit.queueId);
  //   let index = queueList.indexOf(queue);
  //   if(isAddedVisit){
  //     queue.customers = queue.customers + 1;
  //     queueSummary.totalCustomersWaiting = queueSummary.totalCustomersWaiting + 1;
  //     if(queue.waitingTime < visit.waitingTime){
  //       queue.waitingTime = visit.waitingTime;
  //     }
  //     if(queueSummary.maxWaitingTime < visit.waitingTime){
  //       queueSummary.maxWaitingTime = visit.waitingTime;
  //     }
  //   }
  //   else{
  //     queue.customers = queue.customers - 1;
  //     queueSummary.totalCustomersWaiting = queueSummary.totalCustomersWaiting - 1;
  //   }
    
  //   queueSummary.queues[index] = queue;
  //   return queueSummary;
  // }
  //   }}
}
