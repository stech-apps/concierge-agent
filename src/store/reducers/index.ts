import { ActionReducerMap } from '@ngrx/store';
import * as fromSystemInfo from './system-info.reducer';
import { Store } from '@ngrx/store';
import * as fromLicense from './license.reducer';
import * as fromAccount from './account.reducer';


export interface IAppState {
    systemInfo: fromSystemInfo.ISystemInfoState;
    license: fromLicense.ILicenseState;
    account:  fromAccount.IAccountState;
}

export const reducers: ActionReducerMap<IAppState> = {
    systemInfo: fromSystemInfo.reducer,
    license: fromLicense.reducer,
    account: fromAccount.reducer
};
