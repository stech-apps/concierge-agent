import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IServiceState } from '../../reducers/service.reducer';
import { IService } from '../../../models/IService';
import { IServiceGroup } from '../../../models/IServiceGroup';
import { IServiceGroupList } from '../../../models/IServiceGroupList';
import { IServiceConfiguration } from '../../../models/IServiceConfiguration';
import { IServicePoint } from '../../../models/IServicePoint';
import { IServicePointState } from './../../reducers/service-point.reducer';
import { IUTTParameter } from 'src/models/IUTTParameter';
import { forEach } from '@angular/router/src/utils/collection';

// selectors
const getServiceState = createFeatureSelector<IServiceState>('services');
const getServicePointState = createFeatureSelector<IServicePointState>('servicePoints');

const getAllServices = createSelector(
  getServiceState,
  (state: IServiceState) => state.services
);

const isQuickServiceLoaded = createSelector(
  getServiceState,
  (state: IServiceState) => state.servicesConfiguration.length > 0 &&
  state.servicesConfiguration.length === state.services.length ? true : false
);

const getOpenServicePoint = createSelector(
  getServicePointState,
  (state: IServicePointState) => state.openServicePoint
);

const getUttParameters = createSelector(
  getOpenServicePoint,
  (state: IServicePoint) => {
    if (state === null) {
      return null;
    }
    return state.parameters;
  }
);

const getAllQuickServices = createSelector(
  getServiceState,
  (state: IServiceState) => {
    return state.servicesConfiguration.filter(function (val) {
      return val.deliveredServices.length === 0 && val.outcomes.length === 0;
    });
  }
);

const getQuickServices = createSelector(
  getServiceState,
  getUttParameters,
  (serviceState: IServiceState, uttParamState: IUTTParameter) => {
    if (uttParamState.quickServeServices == null || uttParamState.quickServeServices === '') {
      return serviceState.servicesConfiguration.filter(function (val) {
        return val.deliveredServices.length === 0 && val.outcomes.length === 0;
      });
    } else {
      const uttService = uttParamState.quickServeServices.split(',');
      return serviceState.servicesConfiguration.filter(function (val) {
        if (val.deliveredServices.length === 0 && val.outcomes.length === 0) {
          let quickSeriveService = false;
          for (const value of uttService) {
            if (val.id === parseInt(value, 10)) {
              quickSeriveService = true;
              break;
            }
          }
          return quickSeriveService;
        }
      });
    }
  }
);

const getQuickCreateServices = createSelector(
  getServiceState,
  getUttParameters,
  (serviceState: IServiceState, uttParamState: IUTTParameter) => {
    if (uttParamState.quickServeServices == null || uttParamState.quickServeServices === '') {
      return serviceState.services;
    } else {
      const uttService = uttParamState.quickServeServices.split(',');
      if (serviceState.services.length > 0) {
        return serviceState.services.filter(function (val) {
          return this.indexOf(val.id.toString()) >= 0;
        }, uttService);
      } else {
        return serviceState.services;
      }
    }
  }
);

const isQuickServiceEnable = createSelector(
  getAllQuickServices,
  (state: IServiceConfiguration[]) => {
    if (state.length > 0) {
      return true;
    } else {
      return false;
    }
  }
);

export const getSelectedServices = createSelector(
  getServiceState,
  (state: IServiceState) => state.selectedServices
);

export const isServiceLoaded = createSelector(
  getServiceState,
  (state: IServiceState) => state.serviceLoaded
);

@Injectable()
export class ServiceSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  services$ = this.store.select(getAllServices);
  getAllQuickServices$ = this.store.select(getAllQuickServices);
  selectedServices$ = this.store.select(getSelectedServices);
  isQuickServiceEnable$ = this.store.select(isQuickServiceEnable);
  isServiceLoaded$ = this.store.select(isServiceLoaded);
  getQuickServices$ = this.store.select(getQuickServices);
  getQuickCreateServices$ = this.store.select(getQuickCreateServices);
  isQuickServiceLoaded$ = this.store.select(isQuickServiceLoaded);
}
