import * as TimeslotActions from '../actions';
import * as moment from 'moment';

export interface ITimeslotState {
  times: string[];
  selectedTime: string;
  selectedDate?: moment.Moment;
  loading: boolean;
  loaded: boolean;
  error: Object;
}

export const initialState: ITimeslotState = {
  times: [],
  selectedTime: null,
  selectedDate: null,
  loading: false,
  loaded: false,
  error: null
};

export function reducer (
  state: ITimeslotState = initialState,
  action: TimeslotActions.AllTimeslotActions
): ITimeslotState {
  switch (action.type) {
    case TimeslotActions.FETCH_TIMESLOTS: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case TimeslotActions.FETCH_TIMESLOTS_SUCCESS: {
      return {
        ...state,
        times: action.payload.times,
        loading: false,
        loaded: true,
        error: null
      };
    }
    case TimeslotActions.FETCH_TIMESLOTS_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }
    case TimeslotActions.FETCH_TIMESLOTS_BY_VISITORS: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case TimeslotActions.FETCH_TIMESLOTS_BY_VISITORS_SUCCESS: {
      return {
        ...state,
        times: action.payload.times,
        loading: false,
        loaded: true,
        error: null
      };
    }
    case TimeslotActions.FETCH_TIMESLOTS_BY_VISITORS_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }
    case TimeslotActions.RESET_TIMESLOTS: {
      return {
        ...state,
        times: [],
        loaded: false,
        error: null
      };
    }
    case TimeslotActions.SELECT_TIMESLOT: {
      return {
        ...state,
        selectedTime: action.payload
      };
    }
    case TimeslotActions.SELECT_TIMESLOT_DATE: {
      return {
        ...state,
        selectedDate: action.payload
      };
    }
    case TimeslotActions.DESELECT_TIMESLOT: {
      return {
        ...state,
        selectedTime: null
      };
    }
    default: {
      return state;
    }
  }
}
