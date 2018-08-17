import { IAppointment } from './../../models/IAppointment';
import * as AppointmentActions from '../actions';

export interface IAppointmentState {
    appointments: IAppointment[];
    selectedAppointment: IAppointment;
    loading: boolean;
    loaded: boolean;
    error: Object;
}

export const initialState: IAppointmentState = {
    appointments: [],
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
        case AppointmentActions.SEARCH_APPOINTMENTS_SUCCESS: {
            return {
                ...state,
                appointments: action.payload,
                loading: true,
                error: null
            };
        }
        default: {
            return state;
        }
    }
}

