import { ICustomer } from './../../models/ICustomer';
import * as ArriveAppointmentActions from '../actions';

export interface IArriveAppointmentState {
  customer: ICustomer;
  loading: boolean;
  loaded: boolean;
  error: Object;
}

const initialState = {
    customer: null,
  loading: false,
  loaded: false,
  error: null
};

export function reducer(
  state: IArriveAppointmentState = initialState,
  action: ArriveAppointmentActions.AllArriveAppointmentActions
): IArriveAppointmentState {
  switch (action.type) {
    case ArriveAppointmentActions.SELECT_ARRIVED_CUSTOMER: {
      return {
        ...state,
        customer: action.payload,
        loading: true,
        error: null
      };
    }
    default: {
      return state;
    }
  }
}
