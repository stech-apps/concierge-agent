import { IQueueState } from './../../reducers/queue.reducer';
import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IAccountState } from '../../reducers/account.reducer';
import { IAccount } from '../../../models/IAccount';

// // selectors
const getQueueState = createFeatureSelector<IQueueState>('queue');


const getAllQueueSummary = createSelector(
    getQueueState,
    (state: IQueueState) => state.allQueueSummary
);

const getSelectedVisit = createSelector(
    getQueueState,
    (state: IQueueState) => state.selectedVisit
);

const getSelectedQueue = createSelector(
    getQueueState,
    (state:IQueueState) => state.selectedQueue
)

const isFetchVisitInfoFail = createSelector(
    getQueueState,
    (state:IQueueState) => state.error ? true : false
)


@Injectable()
export class QueueSelectors {
    constructor(private store: Store<IAppState>) { }
    // selectors$
    queueSummary$ = this.store.select(getAllQueueSummary);
    selectedVisit$ = this.store.select(getSelectedVisit);
    selectedQueue$ = this.store.select(getSelectedQueue);
    isVisitInfoFail$ = this.store.select(isFetchVisitInfoFail);
}
