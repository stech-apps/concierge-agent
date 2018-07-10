import { ActionReducerMap } from '@ngrx/store';
import * as fromSystemInfo from './system-info.reducer';
import { Store } from '@ngrx/store';
import * as fromLicense from './license.reducer';
import * as fromAccount from './account.reducer';
import * as fromPlatform from './platform.reducer';
import * as fromBranch from './branch.reducer';
import * as fromServices from './service.reducer';
import * as fromServicePoints from './service-point.reducer';


export interface IAppState {
    systemInfo: fromSystemInfo.ISystemInfoState;
    license: fromLicense.ILicenseState;
    account:  fromAccount.IAccountState;
    platform: fromPlatform.IPlatformInfoState; 
    branches: fromBranch.IBranchState;
    services: fromServices.IServiceState,
    servicePoints: fromServicePoints.IServicePointState
}

export const reducers: ActionReducerMap<IAppState> = {
    systemInfo: fromSystemInfo.reducer,
    license: fromLicense.reducer,
    account: fromAccount.reducer,
    platform: fromPlatform.reducer,
    branches: fromBranch.reducer,
    services: fromServices.reducer,
    servicePoints: fromServicePoints.reducer
};
