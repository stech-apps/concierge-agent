
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as QueueVisitsActions from '../../actions';
import { IAppState } from '../../reducers';

import * as AccountActions from '../../actions';
import { Visit } from '../../../models/IVisit';

@Injectable()
export class QueueVisitsDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchQueueVisits(branchId: number,queueId:number) {
    this.store.dispatch(new QueueVisitsActions.FetchQueueVisits(branchId,queueId));
  }
  updateQueueVisits(visits: Visit[]) {
    this.store.dispatch(new QueueVisitsActions.UpdateQueueVisits(visits));
  }
  fetchQueueVisitsLoadedReset() {
    this.store.dispatch(new QueueVisitsActions.FetchQueueVisitsLoadedReset());
  }

}
