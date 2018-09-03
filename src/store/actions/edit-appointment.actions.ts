import { ICustomer } from './../../models/ICustomer';
import { UserRole } from 'src/models/UserPermissionsEnum';
import { Action } from '@ngrx/store';
import { IAppointment } from '../../models/IAppointment';

export const SELECT_EDIT_APPOINTMENT = '[EditAppointment] SELECT_APPOINTMENT';
export const DESELECT_EDIT_APPOINTMENT = '[EditAppointment] DESELECT_APPOINTMENT';

export class SelectEditAppointment implements Action {
  readonly type = SELECT_EDIT_APPOINTMENT;
  constructor(public payload: IAppointment) {}
}

export class DeselectEditAppointment implements Action {
  readonly type = DESELECT_EDIT_APPOINTMENT;
  constructor() {}
}

// Action types
export type AllEditAppointmentActions = 
  | SelectEditAppointment 
  | DeselectEditAppointment;
