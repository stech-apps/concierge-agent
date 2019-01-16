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

const getQueueVisitLoaded = createSelector(
    getQueueVisitsState,
    (state: IQueueVisitsState) => state.loaded
);

const getQueueVisitLoading = createSelector(
    getQueueVisitsState,
    (state: IQueueVisitsState) => state.loading
);


@Injectable()
export class QueueVisitsSelectors {
    constructor(private store: Store<IAppState>) { }
    // selectors$
    queueVisits$ = this.store.select(getQueueVisitse);
    queueVisitLoaded$ = this.store.select(getQueueVisitLoaded);
    queueVisitLoading$ = this.store.select(getQueueVisitLoading);
}
