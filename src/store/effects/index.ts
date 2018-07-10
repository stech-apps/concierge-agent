import { ServicePointEffects } from './service-point.effects';
import { BranchEffects } from './branch.effects';
import { SystemInfoEffects } from './system-info.effects';
import { LicenseInfoEffects } from './license.effects';
import { UserEffects } from './user.effects';
import { UserRoleEffects } from './user-role.effects';
import { AccountEffects } from './account.effects';
import { ServiceEffects } from './service.effects';

export const effects: any[] = [
    SystemInfoEffects,
    LicenseInfoEffects,
    UserEffects,
    UserRoleEffects,
    AccountEffects,
    BranchEffects,
    ServiceEffects,
    ServicePointEffects
];
