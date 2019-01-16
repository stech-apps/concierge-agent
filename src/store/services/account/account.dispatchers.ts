import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';

import * as AccountActions from '../../actions';

@Injectable()
export class AccountDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchAccountInfo() {
    this.store.dispatch(new AccountActions.FetchAccountInfo());
  }

  setUseDefaultStatus(value: boolean) {
      this.store.dispatch(new AccountActions.SetUseDefaultStatus(value));
  }
  setMenuItemStatus(value:boolean){
    this.store.dispatch(new AccountActions.MenuItemDeselect(value))
  }
}
