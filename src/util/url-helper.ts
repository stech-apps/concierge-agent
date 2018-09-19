export const LOGOUT_URL = '/logout.jsp';
export const APP_URL = '/';

const REST = {
    SP_URL: '/rest/servicepoint',
    BACKEND_CALENDAR_URL: '/calendar-backend',
    APPOINTMENT_URL: '/rest/appointment',
    MANAGEMENT_INFO_SERVICE_URL: '/rest/managementinformation',
    CALENDAR_URL: '/calendar-backend/api/v1',
    QSYSTEM_URL: '/qsystem/rest/appointment',
    APPOINTMENTS: 'appointments',
    APPOINTMENT: 'appointment',
    ACCOUNT: 'account',
    GROUPS: 'groups',
    USER: 'user',
    STATUS: 'status',
    BRANCHES: 'branches',
    SERVICE_POINTS: 'servicePoints',
    DEVICE_TYPES: 'deviceTypes',
    FULL: 'full',
    WORK_PROFILES: 'workProfiles',
    SERVICES: 'services',
    POOL: 'pool',
    VISITS: 'visits',
    VISIT: 'visit',
    CREATE: 'create',
    USERS: 'users',
    LOGOUT_FORCE: 'logout;force=true',
    LOGOUT: 'logout',
    NEXT: 'next',
    QUEUES: 'queues',
    END: 'end',
    MARK_TYPES: 'markTypes',
    MARKS: 'marks',
    CUSTOMERS: "customers",
    CUSTOMER: "customer",
    PHONE_NO: "phoneNumber",
    PROPERTIES: "properties",
    EMAIL: "email",
    PHONE: "phone",
    NOSHOW: "noshow",
    OUTCOME: "outcome",
    OUTCOMES: "outcomes",
    DELIVERED_SERVICE: "deliveredServices",
    DELIVERABLE_SERVICES: "deliverableServices",
    WORK_PROFILE: "workProfile",
    JOURNEY: "journey",
    SESSION_VARIABLES: "sessionVariables",
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    PARAMETERS: "parameters",
    SEARCH: "search",
    V1: "v1",
    V2: "v2",
    PUBLIC: "public",
    API: "api",
    SYSTEM_INFORMATION: "systemInformation",
    SLOTS: "slots",
    DATES: "dates",
    TIMES: "times",
    BOOK: "book",
    RESERVE: "reserve",
    CONFIRM: "confirm",
    APPOINTMENT_PROFILES: "appointmentprofiles",
    RESCHEDULE: "reschedule",
    SETTINGS: "settings",
    SERVICE_POINT_POOL: "validForServicePointPoolTransfer",
    USER_POOL: "validForUserPoolTransfer",
    TICKET_ID: "ticketId",
    FROM_ID: "fromId",
    FROM_BRANCH_ID: "fromBranchId",
    VISIT_ID: "visitId",
    SORT_POLICY: "sortPolicy",
    SERVICE_PUBLIC_ID: "servicePublicId",
    NUMBER_OF_CUSTOMERS: "numberOfCustomers",
    CONFIGURATION: "configuration",
    CREATE_END: "createAndEnd",
    SEARCH_CUSTOMER: "searchcustomer",
    CALL_END: "callAndEnd"
}

export const BLOCKED_URLS = (()=> {
    var array_of_services = [];

    //Queue list information fetch
    var queue_list_info = REST.MANAGEMENT_INFO_SERVICE_URL + REST.V2 + REST.BRANCHES + REST.QUEUES;
    array_of_services.push(queue_list_info);

    //Appointment Check In
    var appointment_check_in_services_array = REST.BRANCHES + REST.SERVICE_POINTS + REST.VISIT + REST.CREATE;
    array_of_services.push(appointment_check_in_services_array);


    //Create customer
    var create_customer_services_array = REST.CUSTOMERS;
    array_of_services.push(create_customer_services_array);

    //logout
    var logout_services_array = REST.LOGOUT_FORCE;
    array_of_services.push(logout_services_array);

    //login
    var login_services_array = REST.BRANCHES + REST.SERVICE_POINTS + REST.USERS;
    array_of_services.push(login_services_array);

    //login to counter
    var login_counter_services_array = REST.BRANCHES + REST.SERVICE_POINTS;
    array_of_services.push(login_counter_services_array);

    //Fetch Dates
    var dates_services_array = REST.PUBLIC + REST.API + REST.V1 + REST.BRANCHES + REST.SERVICES + REST.DATES;
    array_of_services.push(dates_services_array);

    //Fetch TimeSlots
    var timeslots_services_array = REST.PUBLIC + REST.API + REST.V1 + REST.BRANCHES + REST.SERVICES + REST.DATES + REST.TIMES;
    array_of_services.push(timeslots_services_array);

    //Reserve timeslot
    var reserve_services_array = REST.PUBLIC + REST.API + REST.V1 + REST.BRANCHES + REST.SERVICES + REST.DATES + REST.TIMES + REST.RESERVE;
    array_of_services.push(reserve_services_array);

    //create customer inapppointment
    var create_customer_appointment_services_array = REST.API + REST.V1 + REST.CUSTOMERS;
    array_of_services.push(create_customer_appointment_services_array);


    //delete visit
    var delete_visit_services_array = REST.BRANCHES + REST.SERVICE_POINTS + REST.VISITS;
    array_of_services.push(delete_visit_services_array);


    //transfer to user pool
    var transfer_user_pool_services_array = REST.BRANCHES + REST.USERS + REST.VISITS;
    array_of_services.push(transfer_user_pool_services_array);


    //transfer to servicepoint pool
    var transfer_servicepoint_pool_services_array = REST.BRANCHES + REST.SERVICE_POINTS + REST.VISITS;
    array_of_services.push(transfer_servicepoint_pool_services_array);


    //transfer to queues pool
    var transfer_queues_pool_services_array = REST.BRANCHES + REST.QUEUES + REST.VISITS;
    array_of_services.push(transfer_queues_pool_services_array);

    //confirm appointment
    var confirm_appointment_services_array = REST.PUBLIC + REST.API + REST.V2 + REST.BRANCHES + REST.APPOINTMENTS + REST.CONFIRM;
    array_of_services.push(confirm_appointment_services_array);

    //Book Apppointment
    var book_appointment_services_array = REST.PUBLIC + REST.API + REST.V2 + REST.BRANCHES + REST.SERVICES + REST.DATES + REST.TIMES + REST.BOOK;
    array_of_services.push(book_appointment_services_array);

    //Reshedule appointment
    var reshedule_appointment_services_array = REST.PUBLIC + REST.API + REST.V1 + REST.APPOINTMENTS + REST.RESCHEDULE;
    array_of_services.push(reshedule_appointment_services_array);

    //Delete appointment
    var delete_appointment_services_array = REST.PUBLIC + REST.API + REST.V1 + REST.APPOINTMENTS;
    array_of_services.push(delete_appointment_services_array);

    //Create Visit
    var create_visit_services_array = REST.BRANCHES + REST.SERVICE_POINTS + REST.CREATE;
    array_of_services.push(create_visit_services_array);

    //Create visit/printer
    var create_visit_printer_services_array = REST.BRANCHES + REST.SERVICE_POINTS + REST.VISIT + REST.CREATE;
    array_of_services.push(create_visit_printer_services_array);


    //Transfer Visit to queue
    var transfer_visit_services_array = REST.BRANCHES + REST.QUEUES + REST.VISITS;
    array_of_services.push(transfer_visit_services_array);


    //Transfer Visit to queue
    var transfer_visit_queues_services_array = REST.BRANCHES + REST.QUEUES + REST.VISITS;
    array_of_services.push(transfer_visit_queues_services_array);


    //Transfer Visit to workstation
    var transfer_visit_workstation_services_array = REST.BRANCHES + REST.SERVICE_POINTS + REST.VISITS;
    array_of_services.push(transfer_visit_workstation_services_array);

    //Call Visit on Cherry pick
    var call_visit_services_array = REST.BRANCHES + REST.SERVICE_POINTS + REST.VISITS;
    array_of_services.push(call_visit_services_array);

    //Delete Visit on Cherry pick
    var end_visit_services_array = REST.BRANCHES + REST.VISITS + REST.END;
    array_of_services.push(end_visit_services_array);
    return array_of_services;
})();
