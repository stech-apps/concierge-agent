import { IQueueVisitsState } from './../../reducers/queue-visits.reducer';
import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IAccountState } from '../../reducers/account.reducer';
import { IAccount } from '../../../models/IAccount';

// // selectors
const getQueueVisitsState = createFeatureSelector<IQueueVisitsState>('queueVisits');


const getQueueVisitse = createSelector(
    getQueueVisitsState,
    (state: IQueueVisitsState) => state.queueVisitsList
);

@Injectable()
export class QueueVisitsSelectors {
    constructor(private store: Store<IAppState>) { }
    // selectors$
    queueVisits$ = this.store.select(getQueueVisitse);
}
