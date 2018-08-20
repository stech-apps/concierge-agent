import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as ArriveAppointmentActions from '../../actions';
import { IAppointment } from '../../../models/IAppointment';

@Injectable()
export class ArriveAppointmentDispatchers {
  constructor(private store: Store<IAppState>) {}

  selectAppointment(appointment: IAppointment) {
    this.store.dispatch(new ArriveAppointmentActions.SelectAppointment(appointment));
  }
}
