import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { NativeApiState } from '../../reducers/native.api.reducer';

// // selectors
const getNativeApiState = createFeatureSelector<NativeApiState>('nativeApi');

const getQRCodeScannerState = createSelector(
  getNativeApiState,
  (state: NativeApiState) => state.isQRCodeScannerLoaded
);

const getQRCode = createSelector(
  getNativeApiState,
  (state: NativeApiState) => state.qrCode
);

@Injectable()
export class NativeApiSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  qrCode$ = this.store.select(getQRCode);
  qrCodeScannerState$ = this.store.select(getQRCodeScannerState);
}
