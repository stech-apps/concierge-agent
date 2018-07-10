import { IServicePointState } from './../../reducers/service-point.reducer';
import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { IServiceState } from '../../reducers/service.reducer';
import { IService } from '../../../models/IService';
import { IServiceGroup } from '../../../models/IServiceGroup';
import { IServiceGroupList } from '../../../models/IServiceGroupList';

// selectors
const getServicePointState = createFeatureSelector<IServicePointState>('servicePoints');

const getAllServicePoints = createSelector(
  getServicePointState,
  (state: IServicePointState) => state.servicePoints
);

@Injectable()
export class ServicePointSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  servicePoints$ = this.store.select(getAllServicePoints);  
}
