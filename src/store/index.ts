export * from './actions';
export * from './effects';
export * from './reducers';
export * from './services';

import { 
    SystemInfoDispatchers, SystemInfoDataService, SystemInfoSelectors, 
    LicenseDataService, LicenseInfoSelectors, LicenseDispatchers, UserRoleDataService,
    UserRoleDispatchers, UserRoleSelectors, UserDataService, UserDispatchers, UserSelectors } from './services';


export const storeServices = [
    SystemInfoDataService,
    SystemInfoDispatchers,
    SystemInfoSelectors,

    LicenseDataService,
    LicenseInfoSelectors,
    LicenseDispatchers,
    UserRoleDataService,
    UserRoleDispatchers,
    UserRoleSelectors,
    UserDataService,
    UserDispatchers,
    UserSelectors
];