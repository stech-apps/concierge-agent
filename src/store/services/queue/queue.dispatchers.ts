
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as QueueActions from '../../actions';
import { IAppState } from '../../reducers';

import * as AccountActions from '../../actions';
import { Visit } from '../../../models/IVisit';
import { Queue } from '../../../models/IQueue';

@Injectable()
export class QueueDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchQueueInfo(branchId: number) {
    this.store.dispatch(new QueueActions.FetchQueueInfo(branchId));
  }

  updateQueueInfo(visit: Visit, isAddedVisit: boolean) {
    this.store.dispatch(new QueueActions.UpdateQueueInfo(visit, isAddedVisit));
  }
  
  fetchSelectedVisit(branchId:number,searchText:string){
    this.store.dispatch(new QueueActions.FetchSelectedVisitInfo(branchId,searchText));
  
  }

  setectQueue(queue:Queue){
    this.store.dispatch(new QueueActions.SelectQueue(queue));
  }

  setectVisit(visit:Visit){
    this.store.dispatch(new QueueActions.SelectVisit(visit));
  }

  resetSelectedQueue(){
    this.store.dispatch(new QueueActions.ResetSelectedQueue());
  }
}
