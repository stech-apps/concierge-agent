export * from './actions';
export * from './effects';
export * from './reducers';
export * from './services';

import { 
    SystemInfoDispatchers, SystemInfoDataService, SystemInfoSelectors, 
    LicenseDataService, LicenseInfoSelectors, LicenseDispatchers } from './services';


export const storeServices = [
    SystemInfoDataService,
    SystemInfoDispatchers,
    SystemInfoSelectors,

    LicenseDataService,
    LicenseInfoSelectors,
    LicenseDispatchers
];