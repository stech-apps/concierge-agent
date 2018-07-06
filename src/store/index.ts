export * from './actions';
export * from './effects';
export * from './reducers';
export * from './services';

import { 
    SystemInfoDispatchers, SystemInfoDataService, SystemInfoSelectors, 
    LicenseDataService, LicenseInfoSelectors, LicenseDispatchers, UserRoleDataService,
    UserRoleDispatchers, UserRoleSelectors, UserDataService, UserDispatchers, UserSelectors,
    AccountDataService, AccountDispatchers, PlatformSelectors, PlatformDispatchers
 } from './services';


export const storeServices = [
    SystemInfoDataService,
    SystemInfoDispatchers,
    SystemInfoSelectors,
    AccountDataService,
    AccountDispatchers,
    LicenseDataService,
    LicenseInfoSelectors,
    LicenseDispatchers,
    UserRoleDataService,
    UserRoleDispatchers,
    UserRoleSelectors,
    UserDataService,
    UserDispatchers,
    UserSelectors,
    PlatformSelectors,
    PlatformDispatchers
];