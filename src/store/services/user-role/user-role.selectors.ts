import { IAccountState } from './../../reducers/account.reducer';
import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IUserRoleState } from './../../reducers/user-role.reducer';

// selectors
const getUserRoleState = createFeatureSelector<IAccountState>('account');

const getUserRole = createSelector(
  getUserRoleState,
  (state: IAccountState) => state.userRole
);

@Injectable()
export class UserRoleSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  userRole$ = this.store.select(getUserRole);
}
