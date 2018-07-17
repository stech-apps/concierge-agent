import { IService } from '../../models/IService';
import * as ServiceActions from '../actions';
import { IServiceGroup } from '../../models/IServiceGroup';

export interface IServiceState {
  services: IService[];
  serviceGroups: IServiceGroup[];
  selectedServices: IService[];
  searchText: string;
  loading: boolean;
  loaded: boolean;
  error: Object;
}

export const initialState: IServiceState = {
  services: [],
  serviceGroups: [],
  selectedServices: [],
  searchText: '',
  loading: false,
  loaded: false,
  error: null
};

export function reducer (
  state: IServiceState = initialState,
  action: ServiceActions.AllServiceActions
): IServiceState {
  switch (action.type) {
    case ServiceActions.FETCH_SERVICES: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case ServiceActions.FETCH_SERVICES_SUCCESS: {
      return {
        ...state,
        services: action.payload,
        loading: false,
        loaded: true,
        error: null
      };
    }
    case ServiceActions.FETCH_SERVICES_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }
    case ServiceActions.SELECT_SERVICE: {
      return {
        ...state,
        selectedServices: [action.payload]
      };
    }
    case ServiceActions.DESELECT_SERVICE: {
      return {
        ...state,
        selectedServices: state.selectedServices.filter(
          (service: IService) =>
            service.id !== action.payload.id
        )
      };
    }
    case ServiceActions.DESELECT_SERVICES: {
      return {
        ...state,
        selectedServices: []
      };
    }
    case ServiceActions.SELECT_MULTI_SERVICE: {
      return {
        ...state,
        selectedServices: [
          ...state.selectedServices,
          action.payload
        ]
      };
    }
    case ServiceActions.FILTER_SERVICES: {
      return {
        ...state,
        searchText: action.payload
      };
    }
    case ServiceActions.RESET_FILTER_SERVICES: {
      return {
        ...state,
        searchText: ''
      };
    }
    case ServiceActions.LOAD_SELECTED_SERVICES: {
      return {
        ...state,
        selectedServices: action.payload
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
function sortServices(serviceList: IService[]): IService[] {
  return serviceList.sort(
    (service1: IService, service2: IService) => {
      if (service1.internalName.toLowerCase() < service2.internalName.toLowerCase() ) { return -1; }
      if (service1.internalName.toLowerCase() > service2.internalName.toLowerCase() ) { return 1; }
      return 0;
    }
  );
}

