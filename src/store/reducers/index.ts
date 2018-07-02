import { ActionReducerMap } from '@ngrx/store';
import * as fromSystemInfo from './system-info.reducer';
import { Store } from '@ngrx/store';


export interface IAppState {
    systemInfo: fromSystemInfo.ISystemInfoState;
}

export const reducers: ActionReducerMap<IAppState> = {
    systemInfo: fromSystemInfo.reducer,
};
