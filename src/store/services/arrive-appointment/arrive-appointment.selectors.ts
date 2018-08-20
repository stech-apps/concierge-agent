import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IArriveAppointmentState } from 'src/store/reducers/arrive-appointment.reducer';

// selectors
const getAppointmentState = createFeatureSelector<IArriveAppointmentState>('arriveAppointment');

const getAppointment = createSelector(
  getAppointmentState,
  (state: IArriveAppointmentState) => state.selectedAppointment
);

@Injectable()
export class ArriveAppointmentSelectors {
  constructor(private store: Store<IAppState>) {}
  selectedAppointment$ = this.store.select(getAppointment);
}
