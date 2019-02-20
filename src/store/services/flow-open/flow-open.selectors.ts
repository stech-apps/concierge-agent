import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IFlowOpenState } from 'src/store/reducers/flow-open.reducer';

// selectors
const getFlowInfoState = createFeatureSelector<IFlowOpenState>('flowOpen');


const getFlowState = createSelector(
  getFlowInfoState,
  (state: IFlowOpenState) => state.FlowOpen
);




@Injectable()
export class FlowOpenSelectors {
  constructor(private store: Store<IAppState>) {}
  FlowOpen$ = this.store.select(getFlowState);
}
