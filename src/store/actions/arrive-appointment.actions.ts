import { ICustomer } from './../../models/ICustomer';
import { UserRole } from 'src/models/UserPermissionsEnum';
import { Action } from '@ngrx/store';
import { IAppointment } from '../../models/IAppointment';

export const SELECT_APPOINTMENT = '[ArriveAppointment] SELECT_APPOINTMENT';
export const DESELECT_APPOINTMENT = '[ArriveAppointment] DESELECT_APPOINTMENT';

export class SelectAppointment implements Action {
  readonly type = SELECT_APPOINTMENT;
  constructor(public payload: IAppointment) {}
}

export class DeselectAppointment implements Action {
  readonly type = DESELECT_APPOINTMENT;
  constructor() {}
}

// Action types
export type AllArriveAppointmentActions = 
  | SelectAppointment 
  | DeselectAppointment;
