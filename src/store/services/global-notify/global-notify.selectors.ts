import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IGlobalNotifyState } from 'src/store/reducers/global-notify.reducer';

// // selectors
const getGlobalNotifyState = createFeatureSelector<IGlobalNotifyState>('globalNotify');

const getError = createSelector(
  getGlobalNotifyState,
  (state: IGlobalNotifyState) => state.error
);

const getWarning = createSelector(
  getGlobalNotifyState,
  (state: IGlobalNotifyState) => state.warning
);

@Injectable()
export class GlobalNotifySelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  error$ = this.store.select(getError);
  warning$ = this.store.select(getWarning);
}
