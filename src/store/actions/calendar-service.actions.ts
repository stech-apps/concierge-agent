import { Action } from '@ngrx/store';
import { ICalendarService } from '../../models/ICalendarService';
import { ICalendarServiceResponse } from '../../models/ICalendarServiceResponse';
import { IServiceGroup } from '../../models/IServiceGroup';
import { ICalendarBranch } from '../../models/ICalendarBranch';

export const FETCH_CALENDAR_SERVICES = '[Calendar Service] FETCH_CALENDAR_SERVICES';
export const FETCH_CALENDAR_SERVICES_FAIL = '[Calendar Service] FETCH_CALENDAR_SERVICES_FAIL';
export const FETCH_CALENDAR_SERVICES_SUCCESS = '[Calendar Service] FETCH_CALENDAR_SERVICES_SUCCESS';

export const FETCH_SERVICE_GROUPS = '[Calendar Service] FETCH_SERVICE_GROUPS';
export const FETCH_SERVICE_GROUPS_FAIL = '[Calendar Service] FETCH_SERVICE_GROUPS_FAIL';
export const FETCH_SERVICE_GROUPS_SUCCESS = '[Calendar Service] FETCH_SERVICE_GROUPS_SUCCESS';

export const GET_SELECTED_CALENDAR_SERVICES = '[Calendar Service] GET_SELECTED_CALENDAR_SERVICES';
export const SET_SELECTED_CALENDAR_SERVICES = '[Calendar Service] SET_SELECTED_CALENDAR_SERVICES';

export const REMOVE_FETCH_SERVICES = '[Calendar Service] REMOVE_FETCH_SERVICES';
export const SERVICES_SELECTION_COMPLETED = '[Calendar Service] SERVICES_SELECTION_COMPLETED';

export const SET_INITIAL_CALENDAR_SERVICES = '[Calendar Service] SET_INITIAL_CALENDAR_SERVICES';
export const SET_CALENDAR_SERVICES_FROM_CACHE = '[Calendar Service] SET_CALENDAR_SERVICES_FROM_CACHE';
export const RESET_INITIAL_CALENDAR_SERVICES = '[Calendar Service] RESET_INITIAL_CALENDAR_SERVICES';

export class FetchCalendarServices implements Action {
    readonly type = FETCH_CALENDAR_SERVICES;
    constructor(public payload: ICalendarBranch) {}
  }

  export class FetchCalendarServicesFail implements Action {
    readonly type = FETCH_CALENDAR_SERVICES_FAIL;
    constructor(public payload: Object) {}
  }

  export class FetchCalendarServicesSuccess implements Action {
    readonly type = FETCH_CALENDAR_SERVICES_SUCCESS;
    constructor(public payload: ICalendarServiceResponse) {}
  }

  export class FetchServiceGroups implements Action {
    readonly type = FETCH_SERVICE_GROUPS;
    constructor(public payload: ICalendarService[], public branch: ICalendarBranch) {}
  }

  export class FetchServiceGroupsFail implements Action {
    readonly type = FETCH_SERVICE_GROUPS_FAIL;
    constructor(public payload: Object) {}
  }
  
  export class FetchServiceGroupsSuccess implements Action {
    readonly type = FETCH_SERVICE_GROUPS_SUCCESS;
    constructor(public payload: ICalendarServiceResponse) {}
  }

  export class GetSelectedCalendarServices implements Action {
    readonly type = GET_SELECTED_CALENDAR_SERVICES;
    constructor(public payload: ICalendarService[]) {}
  }
  
  export class SetSelectedCalendarServices implements Action {
    readonly type = SET_SELECTED_CALENDAR_SERVICES;
    constructor(public payload: ICalendarService[]) {}
  }

  export class RemoveFetchServices implements Action {
    readonly type = REMOVE_FETCH_SERVICES;
  }

  export class ServiceSelectionCompleted implements Action {
    readonly type = SERVICES_SELECTION_COMPLETED;
    constructor(public payload: boolean) {}
  }

  export class SetInitialCalendarServices implements Action {
    readonly type = SET_INITIAL_CALENDAR_SERVICES;
    constructor() {}
  }

  export class SetCalendarServicesFromCache implements Action {
    readonly type = SET_CALENDAR_SERVICES_FROM_CACHE;
    constructor() {}
  }

  export class ResetInitialCalendarServices implements Action {
    readonly type = RESET_INITIAL_CALENDAR_SERVICES;
    constructor() {}
  }

  // Action types
export type AllCalendarServiceActions = 
                                    FetchCalendarServices |
                                    FetchCalendarServicesFail |
                                    FetchCalendarServicesSuccess |
                                    FetchServiceGroups |
                                    FetchServiceGroupsFail |
                                    FetchServiceGroupsSuccess |
                                    GetSelectedCalendarServices |
                                    SetSelectedCalendarServices |
                                    RemoveFetchServices |
                                    ServiceSelectionCompleted |
                                    SetInitialCalendarServices |
                                    SetCalendarServicesFromCache |
                                    ResetInitialCalendarServices;                