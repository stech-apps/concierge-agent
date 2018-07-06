import { IPlatform } from './../../../models/IPlatform';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as actions from '../../actions';
import { IPlatformInfoState } from 'src/store/reducers/platform.reducer';

@Injectable()
export class PlatformDispatchers {
  constructor(private store: Store<IAppState>) {}

  updatePlatform(platform: IPlatform) {
    this.store.dispatch(new actions.PlatformDetected(platform));
  }
}
