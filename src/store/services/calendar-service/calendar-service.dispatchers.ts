import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as ServiceActions from '../../actions';
import { ICalendarBranch } from '../../../models/ICalendarBranch';
import { ICalendarService } from '../../../models/ICalendarService';

@Injectable()
export class CalendarServiceDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchServices(branch: ICalendarBranch) {
    this.store.dispatch(new ServiceActions.FetchCalendarServices);
  }

  fetchServiceGroups(queryString: string) {
    this.store.dispatch(new ServiceActions.FetchServiceGroups(queryString));
  }

  setSelectedServices(services: ICalendarService[]) {
    this.store.dispatch(new ServiceActions.SetSelectedCalendarServices(services));
  }
}
