import { Action } from '@ngrx/store';
import { ICalendarService } from '../../models/ICalendarService';
import { ICalendarServiceResponse } from '../../models/ICalendarServiceResponse';
import { IServiceGroup } from '../../models/IServiceGroup';

export const FETCH_CALENDAR_SERVICES = '[Calendar Service] FETCH_CALENDAR_SERVICES';
export const FETCH_CALENDAR_SERVICES_FAIL = '[Calendar Service] FETCH_CALENDAR_SERVICES_FAIL';
export const FETCH_CALENDAR_SERVICES_SUCCESS = '[Calendar Service] FETCH_CALENDAR_SERVICES_SUCCESS';

export const FETCH_SERVICE_GROUPS = '[Calendar Service] FETCH_SERVICE_GROUPS';
export const FETCH_SERVICE_GROUPS_FAIL = '[Calendar Service] FETCH_SERVICE_GROUPS_FAIL';
export const FETCH_SERVICE_GROUPS_SUCCESS = '[Calendar Service] FETCH_SERVICE_GROUPS_SUCCESS';

export class FetchCalendarServices implements Action {
    readonly type = FETCH_CALENDAR_SERVICES;
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
    constructor(public payload: string) {}
  }
  
  export class FetchServiceGroupsFail implements Action {
    readonly type = FETCH_SERVICE_GROUPS_FAIL;
    constructor(public payload: Object) {}
  }
  
  export class FetchServiceGroupsSuccess implements Action {
    readonly type = FETCH_SERVICE_GROUPS_SUCCESS;
    constructor(public payload: IServiceGroup[]) {}
  }

  // Action types
export type AllCalendarServiceActions = 
                                    FetchCalendarServices |
                                    FetchCalendarServicesFail |
                                    FetchCalendarServicesSuccess |
                                    FetchServiceGroups |
                                    FetchServiceGroupsFail |
                                    FetchServiceGroupsSuccess;