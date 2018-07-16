import { ServiceSelectors } from './services/service/service.selectors';
export * from './actions';
export * from './effects';
export * from './reducers';
export * from './services';

import { 
    SystemInfoDispatchers, SystemInfoDataService, SystemInfoSelectors, 
    LicenseDataService, LicenseInfoSelectors, LicenseDispatchers, UserRoleDataService,
    UserRoleDispatchers, UserRoleSelectors, UserDataService, UserDispatchers, UserSelectors,
    UserStatusDispatchers, UserStatusDataService, UserStatusSelectors,
    AccountDataService, AccountDispatchers, PlatformSelectors, PlatformDispatchers, BranchSelectors,
    BranchDispatchers, BranchDataService, ServiceDispatchers, ServiceDataService, CalendarServiceDataService, CalendarServiceDispatchers, CalendarServiceSelectors
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
    UserStatusDataService,
    UserStatusDispatchers,
    UserStatusSelectors,
    PlatformSelectors,
    PlatformDispatchers,
    BranchSelectors,
    BranchDispatchers,
    BranchDataService,
    ServiceDispatchers,
    ServiceDataService,
    ServiceSelectors,
    CalendarServiceDispatchers,
    CalendarServiceDataService,
    CalendarServiceSelectors,
    ServicePointDataService,
    ServicePointDispatchers,
    ServicePointSelectors
];