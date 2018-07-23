import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';

import * as UserStatusActions from '../../actions/user-status.actions';
import { IUserStatus } from '../../../models/IUserStatus';

@Injectable()
export class UserStatusDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchUserStatus() {
    this.store.dispatch(new UserStatusActions.FetchUserStatus);
  }

  setUserStatus(userStatus: IUserStatus) {
    this.store.dispatch(new UserStatusActions.SetUserStatus(userStatus));
  }
}
