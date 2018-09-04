
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as QueueActions from '../../actions';
import { IAppState } from '../../reducers';

import * as AccountActions from '../../actions';
import { Visit } from '../../../models/IVisit';

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
    this.store.dispatch(new QueueActions.FetchSelectedQueueInfo(branchId,searchText))
  }
}
