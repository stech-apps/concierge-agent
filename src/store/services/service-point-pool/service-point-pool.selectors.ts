import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { IServicePointPool } from '../../../models/IServicePointPool';
import { Injectable } from '@angular/core';
import { IAppState } from '../../reducers';
import { IServicePointPoolState } from '../../reducers/service-point-pool.reducer';

const getServicePointPoolState = createFeatureSelector<IServicePointPoolState>('servicePointPool');

const getAllServicePointPool = createSelector(
    getServicePointPoolState,
    (state: IServicePointPoolState) => state.servicePointPool 
  );

const getServicePointPoolLoading = createSelector(
    getServicePointPoolState,
    (state: IServicePointPoolState) => state.loading 
  );

  const getServicePointPoolLoaded = createSelector(
    getServicePointPoolState,
    (state: IServicePointPoolState) => state.loaded 
  );


  @Injectable()
  export class ServicePointPoolSelectors {
    constructor(private store: Store<IAppState>) {}
    ServicePointPool$ = this.store.select(getAllServicePointPool);
    ServicePointPoolLoading$ = this.store.select(getServicePointPoolLoading);
    ServicePointPoolLoaded$ = this.store.select(getServicePointPoolLoaded);
}