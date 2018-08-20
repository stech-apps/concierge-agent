import { ICustomer } from './../../models/ICustomer';
import { UserRole } from 'src/models/UserPermissionsEnum';
import { Action } from '@ngrx/store';

export const SELECT_ARRIVED_CUSTOMER = '[ArriveAppointment] SELECT_ARRIVED_CUSTOMER';

export class SelectArrivedCustomer implements Action {
  readonly type = SELECT_ARRIVED_CUSTOMER;
  constructor(public payload: ICustomer) {}
}

// Action types
export type AllArriveAppointmentActions =
  | SelectArrivedCustomer;
