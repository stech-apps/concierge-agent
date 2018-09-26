import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';

import * as SystemInfoActions from '../../actions';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class SystemInfoDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchSystemInfo() {
    this.store.dispatch(new SystemInfoActions.FetchSystemInfo);
  }

  setDistributedAgent() {
    this.store.dispatch(new SystemInfoActions.SetDistributedAgent);
  }

  setAuthorizationHeader(headers: HttpHeaders){
    this.store.dispatch(new SystemInfoActions.SetAuthorization(headers));
  }

  resetAuthorizationHeader(){
    this.store.dispatch(new SystemInfoActions.ResetAuthorization);
  }
}
