import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as actions from '../../actions';

@Injectable()
export class FlowOpenDispatchers {
  constructor(private store: Store<IAppState>) {}

  flowOpen() {
    this.store.dispatch(new actions.FlowOpen());
  }

  flowClose() {
    this.store.dispatch(new actions.FlowClose());
  }
}
