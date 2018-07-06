import { ActionReducerMap } from '@ngrx/store';
import * as fromSystemInfo from './system-info.reducer';
import { Store } from '@ngrx/store';
import * as fromLicense from './license.reducer';
import * as fromAccount from './account.reducer';
import * as fromPlatform from './platform.reducer';


export interface IAppState {
    systemInfo: fromSystemInfo.ISystemInfoState;
    license: fromLicense.ILicenseState;
    account:  fromAccount.IAccountState;
    platform: fromPlatform.IPlatformInfoState;
}

export const reducers: ActionReducerMap<IAppState> = {
    systemInfo: fromSystemInfo.reducer,
    license: fromLicense.reducer,
    account: fromAccount.reducer,
    platform: fromPlatform.reducer
};
