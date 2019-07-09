import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IToastStatus } from 'src/store/reducers/toast-status.reducer';

// selectors
const getTosatvalueState = createFeatureSelector<IToastStatus>('toastState');
const getToastState = createSelector(
    getTosatvalueState,
  (state: IToastStatus) => state.value
);




@Injectable()
export class ToastStatusSelectors {
  constructor(private store: Store<IAppState>) {}
  ToastStatus$ = this.store.select(getToastState);
}
