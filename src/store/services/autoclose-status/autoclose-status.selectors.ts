import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IAutoCloseStatus } from 'src/store/reducers/autoclose-status.reducer';

// selectors
const getAutoCloseState = createFeatureSelector<IAutoCloseStatus>('autoCloseState');
const getToastState = createSelector(
    getAutoCloseState,
  (state: IAutoCloseStatus) => state.valueToast
);
const getModalState = createSelector(
  getAutoCloseState,
(state: IAutoCloseStatus) => state.valueModal
);

@Injectable()
export class AutoCloseStatusSelectors {
  constructor(private store: Store<IAppState>) {}
  ToastStatus$ = this.store.select(getToastState);
  ModalStatus$ = this.store.select(getModalState);
}
