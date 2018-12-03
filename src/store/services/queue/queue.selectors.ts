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

const isFetchVisiitError = createSelector(
    getQueueState,
    (state:IQueueState) => state.FetchVisitError ? true : false
)

const getQueueName = createSelector(
    getQueueState,
    (state:IQueueState) => state.queueName
)

const getQueueFetchFailCount = createSelector(
    getQueueState,
    (state:IQueueState) => state.queueFetchFailCount
)
const getqueueVisitIDloading = createSelector(
    getQueueState,
    (state:IQueueState) => state.queueVisitIDloading
)

const getqueueVisitIDloaded = createSelector(
    getQueueState,
    (state:IQueueState) => state.queueVisitIDloaded
)

@Injectable()
export class QueueSelectors {
    constructor(private store: Store<IAppState>) { }
    // selectors$
    queueSummary$ = this.store.select(getAllQueueSummary);
    selectedVisit$ = this.store.select(getSelectedVisit);
    selectedQueue$ = this.store.select(getSelectedQueue);
    isVisitInfoFail$ = this.store.select(isFetchVisitInfoFail);
    isFetchVisiitError$ = this.store.select(isFetchVisiitError);
    queueName$ = this.store.select(getQueueName);
    queueFetchFailCount$ = this.store.select(getQueueFetchFailCount);
    queueVisitIDloading$ =  this.store.select(getqueueVisitIDloading);
    queueVisitIDloaded$ = this.store.select(getqueueVisitIDloaded);
}
