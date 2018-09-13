import { IStaffPool } from '../../models/IStaffPool';
import * as StaffPoolActions from '../actions';

export interface IStaffPoolState {
    staffPool: IStaffPool[];
    loading: boolean;
    loaded: boolean;
    error: Object;
  }

  export const initialState: IStaffPoolState = {
    staffPool: [],
    loading: false,
    loaded: false,
    error: null
  };

  export function reducer (
    state: IStaffPoolState = initialState,
    action: StaffPoolActions.AllStaffPoolActions
  ): IStaffPoolState {
    switch (action.type) {
      case StaffPoolActions.FETCH_STAFF_POOL: {
        return {
          ...state,
          loading: true,
          loaded:false,
          error: null
        };
      }
      case StaffPoolActions.FETCH_STAFF_POOL_SUCCESS: {
        return {
          ...state,
          staffPool: action.payload,
          loading: false,
          loaded: true,
          error: null
        };
      }
  
      case StaffPoolActions.FETCH_FETCH_STAFF_POOL_FAIL: {
        return {
          ...state,
          loading: false,
          loaded:false,
          error: action.payload
        };
      }
      case StaffPoolActions.RESET_STAFF_POOL: {
        return {
          ...state,
          loading: false,
          loaded:false,
          staffPool: []
        };
      }
      default: {
        return state;
      }
    }}