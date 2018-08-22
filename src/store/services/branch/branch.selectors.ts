import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IBranchState } from '../../reducers/branch.reducer';
import { IBranch } from '../../../models/IBranch';


// selectors
const getBranchState = createFeatureSelector<IBranchState>('branches');

const getAllBranches = createSelector(
  getBranchState,
  (state: IBranchState) => state.branches
);

export const getSelectedBranch = createSelector(
  getBranchState,
  (state: IBranchState) => state.selectedBranch
);
export const getPreviousSelectedBranch = createSelector(
  getBranchState,
  (state: IBranchState) => state.previousSelectedBranch
);

const getBranchesSearchText = createSelector(
  getBranchState,
  (state: IBranchState) => state.searchText
);

@Injectable()
export class BranchSelectors {
  constructor(private store: Store<IAppState>) {}  

  branches$ = this.store.select(getAllBranches);
  selectedBranch$ = this.store.select(getSelectedBranch);
  selectPreviousBranch$ = this.store.select(getPreviousSelectedBranch);
}
