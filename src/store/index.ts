import { ServiceSelectors } from './services/service/service.selectors';
export * from './actions';
export * from './effects';
export * from './reducers';
export * from './services';

import { 
    SystemInfoDispatchers, SystemInfoDataService, SystemInfoSelectors, 
    LicenseDataService, LicenseInfoSelectors, LicenseDispatchers, UserRoleDataService,
    UserRoleDispatchers, UserRoleSelectors, UserDataService, UserDispatchers, UserSelectors,
    AccountDataService, AccountDispatchers, PlatformSelectors, PlatformDispatchers, BranchSelectors,
    BranchDispatchers, BranchDataService, ServiceDispatchers, ServiceDataService
 } from './services';
import { ServicePointDataService, ServicePointDispatchers, ServicePointSelectors } from 'src/store/services/service-point';


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
    PlatformDispatchers,
    BranchSelectors,
    BranchDispatchers,
    BranchDataService,
    ServiceDispatchers,
    ServiceDataService,
    ServiceSelectors,
    ServicePointDataService,
    ServicePointDispatchers,
    ServicePointSelectors
];