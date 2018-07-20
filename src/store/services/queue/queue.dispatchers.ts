
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as QueueActions from '../../actions';
import { IAppState } from '../../reducers';

import * as AccountActions from '../../actions';

@Injectable()
export class QueueDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchQueueInfo(branchId: number) {
    this.store.dispatch(new QueueActions.FetchQueueInfo(branchId));
  }
}
