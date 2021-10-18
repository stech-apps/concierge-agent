import { IAccountState } from './../../reducers/account.reducer';
import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { ACCESS_MODULES } from './../../reducers/user-role.reducer';

// selectors
const getUserRoleState = createFeatureSelector<IAccountState>('account');

const getUserRole = createSelector(
  getUserRoleState,
  (state: IAccountState) => state.userRole
);

const getUserAccessApp = createSelector(
  getUserRoleState,
  (state: IAccountState) => {
    if (state.loaded || state.error) {
      if ((state.error && (state.error as any).responseData.status === 401) || state.modules && Object.keys(ACCESS_MODULES).filter(key => state.modules.indexOf(ACCESS_MODULES[key]) < 0).length > 0 && state.modules.indexOf('*') == -1) {
        return false
      }  else {
        return true
      }
    } else {
      return false
    }
  }
);

const getUserRoleLoadState = createSelector(
  getUserRoleState,
  (state: any) => {
    console.log(state && state.error ? true : state.loaded)
    return state && state.error ? true : state.loaded
  }
);

@Injectable()
export class UserRoleSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  userRole$ = this.store.select(getUserRole);
  userRoleLoaded$ = this.store.select(getUserRoleLoadState);
  isUserAccessApp$ = this.store.select(getUserAccessApp);
}
