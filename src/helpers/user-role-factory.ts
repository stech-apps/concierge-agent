import { UserRole } from './../models/UserPermissionsEnum';
import { SUPER_ADMIN_ROLE, CONCIERGE_ROLE, CONNECT_CONCIERGE_ROLE, 
         SERVICEPOINT_ROLE, CALENDAR_ROLE, APPOINTMENT_ROLE } from './../util/orchestra-roles';

export function userRoleFactory(mods: { modules: string[]}) : UserRole {
        let isVisitUserRole = false;
        let isAppointmentUser = false;
        let isSuperAdminUser = false;
        
        let userRole = UserRole.None;

        if (mods.modules.includes(SUPER_ADMIN_ROLE)) {
          userRole = UserRole.All
        }
        else if (mods.modules.includes(CONCIERGE_ROLE) || mods.modules.includes(CONNECT_CONCIERGE_ROLE)) {
          isVisitUserRole = mods.modules.includes(SERVICEPOINT_ROLE);
          isAppointmentUser = mods.modules.includes(CALENDAR_ROLE) && mods.modules.includes(APPOINTMENT_ROLE);
          userRole = isVisitUserRole ? userRole | UserRole.VisitUserRole : userRole;
          userRole = isAppointmentUser ? userRole | UserRole.AppointmentUserRole : userRole;
        }

        return userRole;
}

