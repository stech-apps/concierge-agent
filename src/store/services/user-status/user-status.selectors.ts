import { IUserStatus } from './../../../models/IUserStatus';
import { IUserStatusState } from './../../reducers/user-status.reducer';
import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';


// selectors
const getUserStatusState = createFeatureSelector<IUserStatusState>('userState');

const getUserStatus = createSelector(
  getUserStatusState,
  (state: IUserStatusState) => state.data
);

const getServicePoint = createSelector(
  getUserStatus,
  (state: IUserStatus) => state.servicePointId
);

const getUserState = createSelector(
  getUserStatus,
  (state: IUserStatus) => state.userState
);

const getServicePointStatus = createSelector(
  getUserStatus,
  (state: IUserStatus) => state.servicePointState
);

@Injectable()
export class UserStatusSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  userStatus$ = this.store.select(getUserStatus);
  userState$ = this.store.select(getUserState);
  servicePoint$ = this.store.select(getServicePoint);
  servicePointStatus$ = this.store.select(getServicePointStatus);
}
