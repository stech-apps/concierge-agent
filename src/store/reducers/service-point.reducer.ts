import { servicePoint } from './../services/data.service';
import { IService } from '../../models/IService';
import * as ServicePointActions from '../actions';
import { IServicePoint } from 'src/models/IServicePoint';

export interface IServicePointState {
  servicePoints: IServicePoint[];
  openServicePoint: IServicePoint;
  loading: boolean;
  loaded: boolean;
  error: Object;
}

export const initialState: IServicePointState = {
  servicePoints: [],
  openServicePoint: null,
  loading: false,
  loaded: false,
  error: null
};

export function reducer (
  state: IServicePointState = initialState,
  action: ServicePointActions.AllServicePointActions
): IServicePointState {
  switch (action.type) {
    case ServicePointActions.FETCH_SERVICEPOINTS: {
      return {
        ...state,
        openServicePoint: null,
        loading: true,
        error: null
      };
    }
    case ServicePointActions.FETCH__SERVICEPOINTS_SUCCESS: {
      return {
        ...state,
        servicePoints: sortServicePoints(action.payload.servicePoints),
        loading: false,
        loaded: true,
        error: null
      };
    }
    case ServicePointActions.FETCH__SERVICEPOINTS_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }
    case ServicePointActions.SET_OPEN_SERVICE_POINT: {
      return {
        ...state,
        openServicePoint: action.servicePoint,
      };
    }
    default: {
        return state;
    }
  }
}

/**
 * Sort services alphabetically
 * @param serviceList Fetched serviceList
 */
function sortServicePoints(servicePoints: IServicePoint[]): IServicePoint[] {
  return servicePoints.sort(
    (service1: IServicePoint, service2: IServicePoint) => {
      if (service1.name.toLowerCase() < service2.name.toLowerCase() ) { return -1; }
      if (service1.name.toLowerCase() > service2.name.toLowerCase() ) { return 1; }
      return 0;
    }
  );
}

