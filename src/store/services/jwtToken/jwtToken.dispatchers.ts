import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';

import * as JWTTokenActions from '../../actions';

@Injectable()
export class JWTTokenDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchJWTToken() {
    this.store.dispatch(new JWTTokenActions.FetchJWTToken);
  }
}
