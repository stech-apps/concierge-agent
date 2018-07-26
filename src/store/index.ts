
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
    BranchDispatchers, BranchDataService, ServiceDispatchers, ServiceDataService, CalendarServiceDataService,
    CalendarServiceDispatchers, CalendarServiceSelectors, AccountSelectors, QueueDispatchers, QueueSelectors, QueueDataService,
    ServicePointDataService, ServicePointDispatchers, ServicePointSelectors, ServiceSelectors,CustomerDataService,CustomerDispatchers,CustomerSelector
 } from './services';


export const storeServices = [
    SystemInfoDataService,
    SystemInfoDispatchers,
    SystemInfoSelectors,
    AccountDataService,
    AccountDispatchers,
    AccountSelectors,
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
    ServicePointSelectors,
    QueueDispatchers,
    QueueSelectors,
    QueueDataService,
    CustomerDataService,
    CustomerDispatchers,
    CustomerSelector
    
];