import { IAccount } from './../../../models/IAccount';
import { IAccountState } from './../../reducers/account.reducer';
import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IUserState } from '../../reducers/user.reducer';
import { IUser } from '../../../models/IUser';


// selectors
const getUserState = createFeatureSelector<IAccountState>('account');

const getUser = createSelector(
  getUserState,
  (state: IAccountState) => state.data
);

const getUserFullName = createSelector(
  getUser,
  (state: IAccount) => state.fullName
);

const getUserUserName = createSelector(
  getUser,
  (state: IAccount) => state.userName
);

export const getUserLocale = createSelector(
  getUser,
  (state: IAccount) => state.locale
);

const getUserDirection = createSelector(
  getUser,
  (state: IAccount) => state.direction
);

@Injectable()
export class UserSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  user$ = this.store.select(getUser);
  userFullName$ = this.store.select(getUserFullName);
  userUserName$ = this.store.select(getUserUserName);
  userLocale$ = this.store.select(getUserLocale);
  userDirection$ = this.store.select(getUserDirection);
}
