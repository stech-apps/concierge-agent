import { ActionReducerMap } from '@ngrx/store';
import * as fromSystemInfo from './system-info.reducer';
import { Store } from '@ngrx/store';
import * as fromLicense from './license.reducer';


export interface IAppState {
    systemInfo: fromSystemInfo.ISystemInfoState;
    license: fromLicense.ILicenseState;
}

export const reducers: ActionReducerMap<IAppState> = {
    systemInfo: fromSystemInfo.reducer,
    license: fromLicense.reducer
};
