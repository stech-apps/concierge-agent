import { Action } from '@ngrx/store';
import { IServiceResponse } from '../../models/IServiceResponse';
import { IService } from '../../models/IService';

// Service actions
export const FETCH_SERVICES = '[Service] FETCH_SERVICES';
export const FETCH_SERVICES_FAIL = '[Service] FETCH_SERVICES_FAIL';
export const FETCH_SERVICES_SUCCESS = '[Service] FETCH_SERVICES_SUCCESS';

export const SELECT_SERVICE = '[Service] SELECT_SERVICE';
export const SELECT_MULTI_SERVICE = '[Service] SELECT_MULTI_SERVICE';
export const DESELECT_SERVICE = '[Service] DESELECT_SERVICE';
export const DESELECT_SERVICES = '[Service] DESELECT_SERVICES';
export const FILTER_SERVICES = '[Service] FILTER_SERVICES';
export const RESET_FILTER_SERVICES = '[Service] RESET_FILTER_SERVICES';

export const LOAD_SELECTED_SERVICES = '[Service] LOAD_SELECTED_SERVICES';

export class FetchServices implements Action {
  readonly type = FETCH_SERVICES;
}

export class FetchServicesFail implements Action {
  readonly type = FETCH_SERVICES_FAIL;
  constructor(public payload: Object) {}
}

export class FetchServicesSuccess implements Action {
  readonly type = FETCH_SERVICES_SUCCESS;
  constructor(public payload: IServiceResponse) {}
}

export class SelectService implements Action {
  readonly type = SELECT_SERVICE;
  constructor(public payload: IService) {}
}

export class DeselectService implements Action {
  readonly type = DESELECT_SERVICE;
  constructor(public payload: IService) {}
}

export class DeselectServices implements Action {
  readonly type = DESELECT_SERVICES;
}

export class SelectMultiService implements Action {
  readonly type = SELECT_MULTI_SERVICE;
  constructor(public payload: IService) {}
}

export class FilterServices implements Action {
  readonly type = FILTER_SERVICES;
  constructor(public payload: string) {}
}

export class ResetFilterServices implements Action {
  readonly type = RESET_FILTER_SERVICES;
}

export class LoadSelectedServices implements Action {
  readonly type = LOAD_SELECTED_SERVICES;
  constructor(public payload: IService[]) {}
}

// Action types
export type AllServiceActions = FetchServices |
                                FetchServicesFail |
                                FetchServicesSuccess |
                                SelectService |
                                DeselectService |
                                DeselectServices |
                                SelectMultiService |
                                FilterServices |
                                ResetFilterServices |
                                LoadSelectedServices;
