import { ICustomer } from './../../models/ICustomer';
import * as EditAppointmentActions from '../actions';
import { IAppointment } from '../../models/IAppointment';

export interface IEditAppointmentState {
  selectedAppointment: IAppointment;
  loading: boolean;
  loaded: boolean;
  error: Object;
}

const initialState = {
  selectedAppointment: null,
  loading: false,
  loaded: false,
  error: null
};

export function reducer(
  state: IEditAppointmentState = initialState,
  action: EditAppointmentActions.AllEditAppointmentActions
): IEditAppointmentState {
  switch (action.type) {
    case EditAppointmentActions.SELECT_EDIT_APPOINTMENT: {
      return {
        ...state,
        selectedAppointment: action.payload,
        loading: true,
        error: null
      };
    }

    case EditAppointmentActions.DESELECT_EDIT_APPOINTMENT: {
      return {
        ...state,
        selectedAppointment: null,
        loading: true,
        error: null
      };
    }
    default: {
      return state;
    }
  }
}
