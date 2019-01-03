import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';

import * as GlobalNotifyActions from '../../actions';
import { IGlobalNotification } from 'src/models/IGlobalNotification';

@Injectable()
export class GlobalNotifyDispatchers {
  constructor(private store: Store<IAppState>) {}

  showError(error: IGlobalNotification) {
    this.store.dispatch(new GlobalNotifyActions.GlobalError(error));
  }

  showWarning(warning: IGlobalNotification) {
    this.store.dispatch(new GlobalNotifyActions.GlobalWarning(warning));
  }

  showCriticalCommunicationError() {
    this.store.dispatch(new GlobalNotifyActions.GlobalCriticalCommunicationError());
  }

  hideNotifications() {
    this.store.dispatch(new GlobalNotifyActions.GlobalNotifiyHide());
  }
}
