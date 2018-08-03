import { ICalendarBranch } from './../../../models/ICalendarBranch';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as CalendarBranchActions from '../../actions';

@Injectable()
export class CalendarBranchDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchCalendarBranches() {
    this.store.dispatch(new CalendarBranchActions.FetchCalendarBranches);
  }

  selectCalendarBranch(branch: ICalendarBranch) {
    this.store.dispatch(new CalendarBranchActions.SelectCalendarBranch(branch));
  }

  resetCalendarBranch() {
    this.store.dispatch(new CalendarBranchActions.ResetCalendarBranch);
  }
}
