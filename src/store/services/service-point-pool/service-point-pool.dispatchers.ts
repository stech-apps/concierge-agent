import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';
import * as ServicePointPoolActions from '../../actions';

@Injectable()
export class ServicePointPoolDispatchers {
    constructor(private store: Store<IAppState>) {}

    fetchServicePointPool(branchId:number){
        this.store.dispatch(new ServicePointPoolActions.FetchServicePointInfo(branchId));
    }
   
    resetServicePointPool(){
        this.store.dispatch(new ServicePointPoolActions.ResetServicePointInfo());
    }

}