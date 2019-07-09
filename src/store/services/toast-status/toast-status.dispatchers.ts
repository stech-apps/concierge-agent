import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as actions from '../../actions';

@Injectable()
export class ToastStatusDispatchers {
  constructor(private store: Store<IAppState>) {}

  setToastStatus(value: boolean) {
    this.store.dispatch(new actions.SetToastStatus(value));
  }

  fetchToastStatus() {
    this.store.dispatch(new actions.FetchToastStatus());
  }
}
