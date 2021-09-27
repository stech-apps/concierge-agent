import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as TimeslotActions from '../../actions';
import { IBookingInformation } from '../../../models/IBookingInformation';
import { Moment } from 'moment';

@Injectable()
export class TimeslotDispatchers {
  constructor(private store: Store<IAppState>) {}

  getTimeslots(bookingInformation: IBookingInformation) {
    this.store.dispatch(new TimeslotActions.FetchTimeslots(bookingInformation));
  }

  getTimeslotsByVisitors(bookingInformation: IBookingInformation) {
    this.store.dispatch(new TimeslotActions.FetchTimeslotsByVisitors(bookingInformation));
  }

  selectTimeslot(time: string) {
    this.store.dispatch(new TimeslotActions.SelectTimeslot(time));
  }

  selectTimeslotDate(date: Moment) {
    this.store.dispatch(new TimeslotActions.SelectTimeSlotDate(date));
  }

  deselectTimeslot() {
    this.store.dispatch(new TimeslotActions.DeselectTimeslot);
  }

  resetTimeslots() {
    this.store.dispatch(new TimeslotActions.ResetTimeslots);
  }
}
