import { ICustomer } from './../../../models/ICustomer';
import { SelectArrivedCustomer } from './../../actions/arrive-appointment.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as ArriveAppointmentActions from '../../actions';
import { IAppointment } from '../../../models/IAppointment';

@Injectable()
export class ArriveAppointmentDispatchers {
  constructor(private store: Store<IAppState>) {}

  SelectArrivedCustomer(customer: ICustomer) {
    this.store.dispatch(new ArriveAppointmentActions.SelectArrivedCustomer(customer));
  }
}
