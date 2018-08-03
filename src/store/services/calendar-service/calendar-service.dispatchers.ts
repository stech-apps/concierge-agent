import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as ServiceActions from '../../actions';
import { IService } from '../../../models/IService';

@Injectable()
export class CalendarServiceDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchServices() {
    this.store.dispatch(new ServiceActions.FetchCalendarServices);
  }

  fetchServiceGroups(queryString: string) {
    this.store.dispatch(new ServiceActions.FetchServiceGroups(queryString));
  }
}
