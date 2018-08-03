import { Action } from '@ngrx/store';
import { IServiceResponse } from '../../models/IServiceResponse';
import { IService } from '../../models/IService';
import { IBranch } from '../../models/IBranch';
import { IServiceConfiguration } from '../../models/IServiceConfiguration';

// Service actions
export const FETCH_SERVICES = '[Service] FETCH_SERVICES';
export const FETCH_SERVICES_FAIL = '[Service] FETCH_SERVICES_FAIL';
export const FETCH_SERVICES_SUCCESS = '[Service] FETCH_SERVICES_SUCCESS';

export const GET_SELECTED_SERVICES = '[Service] GET_SELECTED_SERVICES';
export const SET_SELECTED_SERVICES = '[Service] SET_SELECTED_SERVICES';
export const GET_FREQUENT_SERVICES = '[Service] GET_FREQUENT_SERVICES';

export const FETCH_SERVICE_CONFIGURATION = '[Service] FETCH_SERVICE_CONFIGURATION';
export const FETCH_SERVICE_CONFIGURATION_FAIL = '[Service] FETCH_SERVICE_CONFIGURATION_FAIL';
export const FETCH_SERVICE_CONFIGURATION_SUCCESS = '[Service] FETCH_SERVICE_CONFIGURATION_SUCCESS';

export class FetchServices implements Action {
  readonly type = FETCH_SERVICES;
  constructor(public payload: IBranch) {}
}

export class FetchServicesFail implements Action {
  readonly type = FETCH_SERVICES_FAIL;
  constructor(public payload: Object) {}
}

export class FetchServicesSuccess implements Action {
  readonly type = FETCH_SERVICES_SUCCESS;
  constructor(public payload: IService[]) {}
}

export class FetchServiceConfiguration implements Action {
  readonly type = FETCH_SERVICE_CONFIGURATION;
  constructor(public branch: IBranch, public services: IService[]) {}
}

export class FetchServiceConfigurationFail implements Action {
  readonly type = FETCH_SERVICE_CONFIGURATION_FAIL;
  constructor(public payload: Object) {}
}

export class FetchServiceConfigurationSuccess implements Action {
  readonly type = FETCH_SERVICE_CONFIGURATION_SUCCESS;
  constructor(public payload: IServiceConfiguration[]) {}
}

export class GetSelectedServices implements Action {
  readonly type = GET_SELECTED_SERVICES;
  constructor(public payload: IService[]) {}
}

export class SetSelectedServices implements Action {
  readonly type = SET_SELECTED_SERVICES;
  constructor(public payload: IService[]) {}
}

// Action types
export type AllServiceActions = FetchServices |
                                FetchServicesFail |
                                FetchServicesSuccess |
                                FetchServiceConfiguration |
                                FetchServiceConfigurationFail |
                                FetchServiceConfigurationSuccess |
                                GetSelectedServices |
                                SetSelectedServices;
