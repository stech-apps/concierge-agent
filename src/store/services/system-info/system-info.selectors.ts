import { Injectable } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../reducers';
import { ISystemInfoState } from '../../reducers/system-info.reducer';
import { ISystemInfo } from '../../../models/ISystemInfo';

// selectors
const getSystemInfoState = createFeatureSelector<ISystemInfoState>('systemInfo');


const getSystemInfo = createSelector(
  getSystemInfoState,
  (state: ISystemInfoState) => state.data
);

const getSystemInfoProductName = createSelector(
  getSystemInfo,
  (state: ISystemInfo) => state.productName
);

const getSystemInfoReleaseName = createSelector(
  getSystemInfo,
  (state: ISystemInfo) => state.releaseName
);

const getSystemInfoProductVersion = createSelector(
  getSystemInfo,
  (state: ISystemInfo) => state.productVersion
);

const getSystemInfoLicenseCompanyName = createSelector(
  getSystemInfo,
  (state: ISystemInfo) => state.licenseCompanyName
);

const getSystemInfoHost = createSelector(
  getSystemInfo,
  (state: ISystemInfo) => state.host
);

const getSystemInfoHostAddress = createSelector(
  getSystemInfo,
  (state: ISystemInfo) => {
    state.protocol + "://" + state.host + ":" + state.port;
  }
);


const getDistributedAgentStatus = createSelector(
  getSystemInfoState,
  (state: ISystemInfoState) => state.isDistributedAgent
);


@Injectable()
export class SystemInfoSelectors {
  constructor(private store: Store<IAppState>) {}
  // selectors$
  systemInfo$ = this.store.select(getSystemInfo);
  systemInfoProductName$ = this.store.select(getSystemInfoProductName);
  systemInfoReleaseName$ = this.store.select(getSystemInfoReleaseName);
  systemInfoProductVersion$ = this.store.select(getSystemInfoProductVersion);
  systemInfoLicenseCompanyName$ = this.store.select(getSystemInfoLicenseCompanyName);
  systemInfoHost$ = this.store.select(getSystemInfoHost);
  systemInfoHostAddress$ = this.store.select(getSystemInfoHostAddress);
  DistributedAgentStatus$ = this.store.select(getDistributedAgentStatus);
}
