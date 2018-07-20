import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IServiceState } from '../../reducers/service.reducer';
import { IService } from '../../../models/IService';
import { IServiceGroup } from '../../../models/IServiceGroup';
import { IServiceGroupList } from '../../../models/IServiceGroupList';

// selectors
const getServiceState = createFeatureSelector<IServiceState>('services');

const getAllServices = createSelector(
  getServiceState,
  (state: IServiceState) => state.services
);

const getAllConfigServices = createSelector(
  getServiceState,
  (state: IServiceState) => state.servicesConfiguration
);

export const getSelectedServices = createSelector(
  getServiceState,
  (state: IServiceState) => state.selectedServices
);

@Injectable()
export class ServiceSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  services$ = this.store.select(getAllServices);
  configServices$ = this.store.select(getAllConfigServices);
  selectedServices$ = this.store.select(getSelectedServices);
}
