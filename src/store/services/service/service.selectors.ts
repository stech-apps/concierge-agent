import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IServiceState } from '../../reducers/service.reducer';
import { IService } from '../../../models/IService';
import { IServiceGroup } from '../../../models/IServiceGroup';
import { IServiceGroupList } from '../../../models/IServiceGroupList';
import { IServiceConfiguration } from '../../../models/IServiceConfiguration';

// selectors
const getServiceState = createFeatureSelector<IServiceState>('services');

const getAllServices = createSelector(
  getServiceState,
  (state: IServiceState) => state.services
);

const getAllQuickServices = createSelector(
  getServiceState,
  (state: IServiceState) => {
    return state.servicesConfiguration.filter(function (val){
      return val.deliveredServices.length === 0 && val.outcomes.length === 0
    })
  }
);

const isQuickServiceEnable = createSelector(
  getAllQuickServices,
  (state: IServiceConfiguration[]) => {
    if(state.length > 0)
      return true;
    else
      return false;
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
  quickServices$ = this.store.select(getAllQuickServices);
  selectedServices$ = this.store.select(getSelectedServices);
  isQuickServiceEnable$ = this.store.select(isQuickServiceEnable);
  isServiceLoaded$ = this.store.select(isServiceLoaded);
}
