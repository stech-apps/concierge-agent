import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as StaffPoolActions from '../../actions';

@Injectable()
export class StaffPoolDispatchers {
    constructor(private store: Store<IAppState>) {}
  
    fetchStaffPool(branchId:number) {
      this.store.dispatch(new StaffPoolActions.FetchStaffPool(branchId));
    }
    resetStaffPool(){
      this.store.dispatch(new StaffPoolActions.ResetStaffPool());
    }
}