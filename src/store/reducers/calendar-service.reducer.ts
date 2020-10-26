import { ICalendarService } from '../../models/ICalendarService';
import * as ServiceActions from '../actions';
import { IServiceGroup } from '../../models/IServiceGroup';

export interface ICalendarServiceState {
    services: ICalendarService[];
    initialServices: ICalendarService[];
    selectedServices: ICalendarService[];
    searchText: string;
    loading: boolean;
    loaded: boolean;
    error: Object;
    serviceSelectionCompleted: boolean;
  }
  
  export const initialState: ICalendarServiceState = {
    services: null,
    initialServices: null,
    selectedServices: [],
    searchText: '',
    loading: false,
    loaded: false,
    error: null,
    serviceSelectionCompleted: false
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
          serviceSelectionCompleted: false
        };
      }
      case ServiceActions.FETCH_CALENDAR_SERVICES_SUCCESS: {
        return {
          ...state,
          services: sortServices(concatService(action.payload)),
          selectedServices: [],
          loading: false,
          loaded: true,
          error: null,
          serviceSelectionCompleted: false
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
          error: null,
          serviceSelectionCompleted: false
        };
      }
      case ServiceActions.FETCH_SERVICE_GROUPS_SUCCESS: {
        return {
          ...state,
          services: processServices(state.selectedServices, concatService(action.payload)),
          loading: false,
          loaded: true,
          error: null,
          serviceSelectionCompleted: false
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
          selectedServices: action.payload,
          serviceSelectionCompleted: false
        };
      }
      case ServiceActions.REMOVE_FETCH_SERVICES: {
        return {
          ...state,
          services: null
        };
      }
      case ServiceActions.SERVICES_SELECTION_COMPLETED: {
        return {
          ...state,
          serviceSelectionCompleted : true
        };
      }
      case ServiceActions.SET_INITIAL_CALENDAR_SERVICES: {
        return {
          ...state,
          initialServices: state.services,
        };
      }
      case ServiceActions.SET_CALENDAR_SERVICES_FROM_CACHE: {
        return {
          ...state,
          services: state.initialServices,
        };
      }
      case ServiceActions.RESET_INITIAL_CALENDAR_SERVICES: {
        return {
          ...state,
          services: null,
          initialServices: null
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
    return serviceList.slice().sort(
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

  function concatService(services: any){
    var tempArr = [];
    services.forEach(element => {
      var merged = [].concat.apply([], element.services);
      tempArr.push(...merged);
    });

    return removeDuplicates(tempArr);
  }

  function removeDuplicates(arr) {
    let obj = {};
    return Object.keys(arr.reduce((prev, next) => {
      if(!obj[next['publicId']]) obj[next['publicId']] = next; 
      return obj;
    }, obj)).map((i) => obj[i]);
  }
  