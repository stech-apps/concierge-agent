import { IAppointment } from './../../models/IAppointment';
import * as AppointmentActions from '../actions';

export interface IAppointmentState {
    appointments: IAppointment[];
    calendarAppointments: IAppointment[];
    selectedAppointment: IAppointment;
    loading: boolean;
    loaded: boolean;
    error: Object;
}

export const initialState: IAppointmentState = {
    appointments: [],
    calendarAppointments: [],
    selectedAppointment: null,
    loading: false,
    loaded: false,
    error: null
};

export function reducer(
    state: IAppointmentState = initialState,
    action: AppointmentActions.AllAppointmentActions
): IAppointmentState {
    switch (action.type) {

        case AppointmentActions.SEARCH_APPOINTMENTS: {
            return {
                ...state,
                loaded: false,
                loading: true
            };
        }

        case AppointmentActions.SEARCH_APPOINTMENTS_SUCCESS: {
            return {
                ...state,
                appointments: Array.isArray(action.payload) ? action.payload : [action.payload],
                loading: false,
                loaded: true,
                error: null
            };
        }

        case AppointmentActions.SEARCH_APPOINTMENTS_FAIL: {
            return {
                ...state,
                loading: false,
                loaded: true,
                error: action.payload
            };
        }

        case AppointmentActions.DELETE_APPOINTMENT: {
            return {
              ...state,
              loading: true,
              loaded: false,
              error: null
            };
          }

        case AppointmentActions.DELETE_APPOINTMENT_SUCCESS: {
            return {
              ...state,
              loading: false,
              loaded: true,
              error: null
            };
          }
          case AppointmentActions.DELETE_APPOINTMENT_FAIL: {
            return {
              ...state,
              loading: false,
              loaded: true,
              error: action.payload
            };
          }

        case AppointmentActions.SEARCH_CALENDAR_APPOINTMENTS: {
            return {
                ...state,
                loading: true,
                loaded: false
            };
        }

        case AppointmentActions.SEARCH_CALENDAR_APPOINTMENTS_SUCCESS: {
            return {
                ...state,
                calendarAppointments: Array.isArray(action.payload.appointmentList) ? action.payload.appointmentList : [action.payload],
                loading: false,
                loaded: true,
                error: null
            };
        }

        case AppointmentActions.SEARCH_CALENDAR_APPOINTMENTS_FAIL: {
            return {
                ...state,
                loading: false,
                loaded: true,
                error: action.payload
            };
        }
        default: {
            return state;
        }
    }
}

