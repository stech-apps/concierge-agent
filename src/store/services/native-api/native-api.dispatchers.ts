import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';

import * as NativeApiActions from '../../actions/native.api.actions';

@Injectable()
export class NativeApiDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchQRCodeInfo(qrCode: string) {
    this.store.dispatch(new NativeApiActions.FetchQRCodeInfo(qrCode));
  }

  closeQRCodeScanner() {
    this.store.dispatch(new NativeApiActions.ResetQRCodeScanner());
  }

  openQRCodeScanner() {
      this.store.dispatch(new NativeApiActions.OpenQRCodeScanner());
  }

  resetQRCodeInfo(qrCode: string) {
    this.store.dispatch(new NativeApiActions.ResetQRCode());
  }
}