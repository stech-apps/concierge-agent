import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IArriveAppointmentState } from 'src/store/reducers/arrive-appointment.reducer';

// selectors
const getAppointmentState = createFeatureSelector<IArriveAppointmentState>('arriveAppointment');

const getArrivedCustomer = createSelector(
  getAppointmentState,
  (state: IArriveAppointmentState) => state.customer
);

@Injectable()
export class ArriveAppointmentSelectors {
  constructor(private store: Store<IAppState>) {}
  arrivedCustomer$ = this.store.select(getArrivedCustomer);
}
