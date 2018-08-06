import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { ICalendarBranchState } from '../../reducers/calendar-branch.reducer';

// selectors
const getBranchState = createFeatureSelector<ICalendarBranchState>('calendarBranches');

const getAllCalendarBranches = createSelector(
  getBranchState,
  (state: ICalendarBranchState) => state.branches
);

export const getSelectedCalendarBranch = createSelector(
  getBranchState,
  (state: ICalendarBranchState) => state.selectedBranch
);

export const isPublicBranchesLoaded = createSelector(
  getBranchState,
  (state: ICalendarBranchState) => state.publicBranchesLoaded
);

@Injectable()
export class CalendarBranchSelectors {
  constructor(private store: Store<IAppState>) {}
  
  branches$ = this.store.select(getAllCalendarBranches);
  selectedBranch$ = this.store.select(getSelectedCalendarBranch);
  isPublicBranchesLoaded$ = this.store.select(isPublicBranchesLoaded);
}
