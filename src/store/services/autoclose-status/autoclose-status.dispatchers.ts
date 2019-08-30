import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as actions from '../../actions';

@Injectable()
export class AutoCloseStatusDispatchers {
  constructor(private store: Store<IAppState>) {}

  setToastStatus(value: boolean) {
    this.store.dispatch(new actions.SetAutoCloseToastStatus(value));
  }

  fetchToastStatus() {
    this.store.dispatch(new actions.FetchAutoCloseToastStatus());
  }

  setModalStatus(value: boolean) {
    this.store.dispatch(new actions.SetAutoCloseModalStatus(value));
  }

  fetchModalStatus() {
    this.store.dispatch(new actions.FetchAutoCloseModalStatus());
  }
}
