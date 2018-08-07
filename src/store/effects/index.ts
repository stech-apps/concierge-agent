import { QueueEffects } from './queue.effects';
import { ServicePointEffects } from './service-point.effects';
import { BranchEffects } from './branch.effects';
import { SystemInfoEffects } from './system-info.effects';
import { LicenseInfoEffects } from './license.effects';
import { UserEffects } from './user.effects';
import { UserStatusEffects } from './user-status.effects';
import { UserRoleEffects } from './user-role.effects';
import { AccountEffects } from './account.effects';
import { ServiceEffects } from './service.effects';
import { CalendarServiceEffects } from './calendar-service.effects';
import {CustomerEffects} from './customer.effects'
import { CalendarSettingsEffects } from './calendar-settings.effects';
import { TimeslotEffects } from './timeslot.effects';
import { CalendarBranchEffects } from './calendar-branch.effects';
import { ReserveEffects } from './reserve.effects';

export const effects: any[] = [
    SystemInfoEffects,
    LicenseInfoEffects,
    UserEffects,
    UserStatusEffects,
    UserRoleEffects,
    AccountEffects,
    BranchEffects,
    ServiceEffects,
    ServicePointEffects,
    QueueEffects,
    CalendarServiceEffects,
    CustomerEffects,
    CalendarSettingsEffects,
    TimeslotEffects,
    CalendarBranchEffects,
    ReserveEffects
];
