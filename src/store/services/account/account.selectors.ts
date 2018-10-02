import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IAccountState } from '../../reducers/account.reducer';
import { IAccount } from '../../../models/IAccount';

// // selectors
const getUserState = createFeatureSelector<IAccountState>('account');

// const getUser = createSelector(
//   getUserState,
//   (state: IAccountState) => state.data
// );

// const getUserFullName = createSelector(
//   getUser,
//   (state: IAccount) => state.fullName
// );

// const getUserUserName = createSelector(
//   getUser,
//   (state: IAccount) => state.userName
// );

// export const getUserLocale = createSelector(
//   getUser,
//   (state: IAccount) => state.locale
// );

// const getUserDirection = createSelector(
//   getUser,
//   (state: IAccount) => state.direction
// );

const getUserRole = createSelector(
  getUserState,
  (state: IAccountState) => state.userRole
);

const getUseDefaultStatus = createSelector(
  getUserState,
  (state: IAccountState) => state.useDefaultStatus
);


const MenuItemStatus = createSelector(
  getUserState,
  (state: IAccountState) => state.menuItemDeselect
);

@Injectable()
export class AccountSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  userRole$ = this.store.select(getUserRole);
  useDefaultStatus$ = this.store.select(getUseDefaultStatus);
  MenuItemStatus = this.store.select(MenuItemStatus);
}
