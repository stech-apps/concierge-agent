import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { IAppState } from '../../reducers';
import { IStaffPoolState } from '../../reducers/staff-pool.reducer';

const getStaffPoolState = createFeatureSelector<IStaffPoolState>('staffPool');

const getAllStaffPool = createSelector(
    getStaffPoolState,
    (state: IStaffPoolState) => state.staffPool 
  );

  @Injectable()
export class StaffPoolSelectors {
  constructor(private store: Store<IAppState>) {}  

  StaffPool$ = this.store.select(getAllStaffPool);
 
}
