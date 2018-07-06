import { IPlatform } from './../../models/IPlatform';
import { Action } from '@ngrx/store';
import { IPlatformInfoState } from './../reducers/platform.reducer';

export const PLATFORM_DETECTED = '[platform] PLATFORM_DETECTED';

export class PlatformDetected implements Action {
    readonly type = PLATFORM_DETECTED;
    constructor(public payload: IPlatform) {}
}