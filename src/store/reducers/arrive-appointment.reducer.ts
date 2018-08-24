import { ICustomer } from './../../models/ICustomer';
import * as ArriveAppointmentActions from '../actions';
import { IAppointment } from '../../models/IAppointment';

export interface IArriveAppointmentState {
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
  state: IArriveAppointmentState = initialState,
  action: ArriveAppointmentActions.AllArriveAppointmentActions
): IArriveAppointmentState {
  switch (action.type) {
    case ArriveAppointmentActions.SELECT_APPOINTMENT: {
      return {
        ...state,
        selectedAppointment: action.payload,
        loading: true,
        error: null
      };
    }

    case ArriveAppointmentActions.DESELECT_APPOINTMENT: {
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
