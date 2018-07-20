import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as ServiceActions from '../../actions';
import { IService } from '../../../models/IService';
import { IBranch } from '../../../models/IBranch';

@Injectable()
export class ServiceDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchServices(branch : IBranch) {
    this.store.dispatch(new ServiceActions.FetchServices(branch));
  }

  fetchServiceConfiguration(branch: IBranch, services: IService[]) {
    this.store.dispatch(new ServiceActions.FetchServiceConfiguration(branch, services));
  }

  fetchServiceGroups(queryString: string) {
    this.store.dispatch(new ServiceActions.FetchServiceGroups(queryString));
  }

  filterServices(searchText: string) {
    this.store.dispatch(new ServiceActions.FilterServices(searchText));
  }

  selectService(service: IService) {
    this.store.dispatch(new ServiceActions.SelectService(service));
  }

  deselectService(service: IService) {
    this.store.dispatch(new ServiceActions.DeselectService(service));
  }

  selectMultiService(service: IService) {
    this.store.dispatch(new ServiceActions.SelectMultiService(service));
  }

  deselectServices() {
    this.store.dispatch(new ServiceActions.DeselectServices);
  }

  resetFilterServices() {
    this.store.dispatch(new ServiceActions.ResetFilterServices);
  }
}
