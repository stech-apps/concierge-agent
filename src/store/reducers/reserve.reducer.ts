import { FETCH_RESERVABLE_DATES_FAIL } from './../actions/reserve.actions';
import { IAppointment } from '../../models/IAppointment';
import * as ReserveActions from '../actions';
import * as moment from 'moment';

export interface IReserveState {
  reservedAppointment: IAppointment;
  reservableDates?: moment.Moment[]
  loading: boolean;
  loaded: boolean;
  error: Object;
}

export const initialState: IReserveState = {
  reservedAppointment: null,
  reservableDates: [],
  loading: false,
  loaded: false,
  error: null
};

export function reducer(
  state: IReserveState = initialState,
  action: ReserveActions.AllReserveActions
): IReserveState {
  switch (action.type) {
    case ReserveActions.RESERVE_APPOINTMENT: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case ReserveActions.RESERVE_APPOINTMENT_SUCCESS: {
      return {
        ...state,
        reservedAppointment: action.payload,
        loading: false,
        loaded: true,
        error: null
      };
    }
    case ReserveActions.RESERVE_APPOINTMENT_FAILIURE_REPORT: {
      return {
        ...state,
        loading: false,
        reservedAppointment: null,
        error: action.payload
      };
    }
    case ReserveActions.UNRESERVE_APPOINTMENT: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case ReserveActions.UNRESERVE_APPOINTMENT_SUCCESS: {
      return {
        ...state,
        reservedAppointment: null,
        loading: false,
        loaded: true,
        error: null
      };
    }
    case ReserveActions.UNRESERVE_APPOINTMENT_FAIL: {
      return {
        ...state,
        reservedAppointment: null,
        loading: false,
        error: action.payload
      };
    }
    case ReserveActions.FETCH_RESERVABLE_DATES_SUCCESS: {
      return {
        ...state,
        reservableDates: parseReservableDates(action.payload.dates),
        loading: false,
        loaded: true,
        error: null
      };
    }
    case ReserveActions.FETCH_RESERVABLE_DATES_FAIL: {
      return {
        ...state,
        reservableDates: [],
        loading: false,
        error: action.payload
      };
    }
    case ReserveActions.RESET_RESERVED_APPOINTMENT: {
      return {
        ...state,
        reservedAppointment: null
      };
    }
    default: {
      return state;
    }
  }
}

function parseReservableDates(dates: string[]): moment.Moment[] {

  if (dates.length > 0) {

    return dates.map((d) => {
      return moment(d)
    });
  }
  else {
    return [];
  }
}
