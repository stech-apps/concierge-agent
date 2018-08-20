import { ICalendarService } from '../../models/ICalendarService';
import * as ServiceActions from '../actions';
import { IServiceGroup } from '../../models/IServiceGroup';

export interface ICalendarServiceState {
    services: ICalendarService[];
    serviceGroups: IServiceGroup[];
    selectedServices: ICalendarService[];
    searchText: string;
    loading: boolean;
    loaded: boolean;
    error: Object;
    serviceLoaded: boolean;
  }
  
  export const initialState: ICalendarServiceState = {
    services: [],
    serviceGroups: [],
    selectedServices: [],
    searchText: '',
    loading: false,
    loaded: false,
    error: null,
    serviceLoaded: false
  };
  
  export function reducer (
    state: ICalendarServiceState = initialState,
    action: ServiceActions.AllCalendarServiceActions
  ): ICalendarServiceState {
    switch (action.type) {
      case ServiceActions.FETCH_CALENDAR_SERVICES: {
        return {
          ...state,
          loading: true,
          error: null,
          serviceLoaded: false
        };
      }
      case ServiceActions.FETCH_CALENDAR_SERVICES_SUCCESS: {
        return {
          ...state,
          services: action.payload[0]? sortServices(action.payload[0].services): [],
          loading: false,
          loaded: true,
          error: null,
          serviceLoaded: true
        };
      }
      case ServiceActions.FETCH_CALENDAR_SERVICES_FAIL: {
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      }
      case ServiceActions.FETCH_SERVICE_GROUPS: {
        return {
          ...state,
          loading: true,
          error: null
        };
      }
      case ServiceActions.FETCH_SERVICE_GROUPS_SUCCESS: {
        return {
          ...state,
          services: processServices(state.selectedServices, action.payload[0].services),
          loading: false,
          loaded: true,
          error: null
        };
      }
      case ServiceActions.FETCH_SERVICE_GROUPS_FAIL: {
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      }
      case ServiceActions.SET_SELECTED_CALENDAR_SERVICES: {
        return {
          ...state,
          selectedServices: action.payload
        };
      }
      case ServiceActions.REMOVE_FETCH_SERVICES: {
        return {
          ...state,
          serviceLoaded : false
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
  function sortServices(serviceList: ICalendarService[]): ICalendarService[] {
    return serviceList.sort(
      (service1: ICalendarService, service2: ICalendarService) => {
        if (service1.name.toLowerCase() < service2.name.toLowerCase() ) { return -1; }
        if (service1.name.toLowerCase() > service2.name.toLowerCase() ) { return 1; }
        return 0;
      }
    );
  }

  function processServices(selectedServiceList: ICalendarService[], serviceList: any): ICalendarService[] {
    var remainList = [];
    serviceList.forEach(val => {
      var elementPos = selectedServiceList.map(function(x) {return x.publicId; }).indexOf(val.publicId);
      if(elementPos < 0){
        remainList.push(val);
      }
    })
    
    return sortServices(remainList);
  }
  