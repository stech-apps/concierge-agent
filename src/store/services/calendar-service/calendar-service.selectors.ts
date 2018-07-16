import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { ICalendarServiceState } from '../../reducers/calendar-service.reducer';
import { IServiceGroup } from '../../../models/IServiceGroup';
import { IServiceGroupList } from '../../../models/IServiceGroupList';

// selectors
const getServiceState = createFeatureSelector<ICalendarServiceState>('calendarServices');

const getAllServices = createSelector(
  getServiceState,
  (state: ICalendarServiceState) => state.services
);

export const getSelectedCalendarServices = createSelector(
  getServiceState,
  (state: ICalendarServiceState) => state.selectedServices
);

export const getServiceGroups = createSelector(
  getServiceState,
  (state: ICalendarServiceState) => state.serviceGroups
);

@Injectable()
export class CalendarServiceSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  services$ = this.store.select(getAllServices);
  selectedServices$ = this.store.select(getSelectedCalendarServices);
}
