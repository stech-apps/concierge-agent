import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as ServicePointActions from '../../actions';
import { IService } from '../../../models/IService';
import { IServicePoint } from '../../../models/IServicePoint';

@Injectable()
export class ServicePointDispatchers {
  constructor(private store: Store<IAppState>) {}

  fetchServicePointsByBranch(branchId: number) {
    this.store.dispatch(new ServicePointActions.FetchServicePoints(branchId));
  }

  setOpenServicePoint(servicePoint: IServicePoint) {
    this.store.dispatch(new ServicePointActions.SetOpenServicePoint(servicePoint));
  }
}
