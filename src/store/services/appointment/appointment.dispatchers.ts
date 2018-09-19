import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as AppointmentActions from '../../actions';
import { IAppointment } from '../../../models/IAppointment';

@Injectable()
export class AppointmentDispatchers {
  constructor(private store: Store<IAppState>) {}

  searchAppointments(appointmentSearchInfo: any) {
    this.store.dispatch(new AppointmentActions.SearchAppointments(appointmentSearchInfo));
  }

  searchCalendarAppointments(appointmentSearchInfo: any) {
    this.store.dispatch(new AppointmentActions.SearchCalendarAppointments(appointmentSearchInfo));
  }

  deleteAppointment(appointment: IAppointment, successCallback: any, errorCallback: any) {
    this.store.dispatch(new AppointmentActions.DeleteAppointment(appointment, successCallback, errorCallback));
  }

  rescheduleAppointment(appointment: IAppointment) {
    this.store.dispatch(new AppointmentActions.RescheduleAppointment(appointment));
  }

  resetError(){
    this.store.dispatch(new AppointmentActions.ResetAppointmentError());
  }
}
