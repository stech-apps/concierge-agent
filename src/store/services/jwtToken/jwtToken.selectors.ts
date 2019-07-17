import { IJWTToken } from './../../../models/IJWTToken';
import { IJWTTokenState } from './../../reducers/jwtToken.reducer';
import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';

// selectors
const getJWTTokenState = createFeatureSelector<IJWTTokenState>('jwtToken');

const getJWTToken = createSelector(
  getJWTTokenState,
  (state: IJWTTokenState) => state.token
);

@Injectable()
export class JWTTokenSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  jwtToken$ = this.store.select(getJWTToken);
}
