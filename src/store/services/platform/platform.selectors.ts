import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../../reducers';
import { IPlatformInfoState } from 'src/store/reducers/platform.reducer';

// selectors
const getPlatformState = createFeatureSelector<IPlatformInfoState>('platform');


const isMobile = createSelector(
    getPlatformState,
    (state: IPlatformInfoState) => state.isMobile
);

const getUserAgent = createSelector(
    getPlatformState,
    (state: IPlatformInfoState) => state.userAgent
);

@Injectable()
export class PlatformSelectors {
  constructor(private store: Store<IAppState>) {}
  userAgent$ = this.store.select(getUserAgent);
  isMobile$ = this.store.select(isMobile);
}
