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

export const getSelectedServices = createSelector(
  getServiceState,
  (state: IServiceState) => state.selectedServices
);

export const getServiceGroups = createSelector(
  getServiceState,
  (state: IServiceState) => state.serviceGroups
);

@Injectable()
export class ServiceSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  services$ = this.store.select(getAllServices);
  selectedServices$ = this.store.select(getSelectedServices);
}
