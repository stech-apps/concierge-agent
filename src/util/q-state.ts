export enum VISIT_STATE {
    OK = "OK",
    CONFIRM_NEEDED = "CONFIRM_NEEDED",
    DELIVERED_SERVICE_NEEDED = "DELIVERED_SERVICE_NEEDED",
    OUTCOME_NEEDED = "OUTCOME_NEEDED",
    OUTCOME_FOR_DELIVERED_SERVICE_NEEDED = "OUTCOME_FOR_DELIVERED_SERVICE_NEEDED",
    OUTCOME_OR_DELIVERED_SERVICE_NEEDED = "OUTCOME_OR_DELIVERED_SERVICE_NEEDED",
    WRAPUP = "WRAPUP",
    VISIT_IN_DISPLAY_QUEUE = "VISIT_IN_DISPLAY_QUEUE",
    CALL_NEXT_TO_QUICK = "CALL_NEXT_TO_QUICK"
}

export enum USER_STATE {
    NO_STARTED_USER_SESSION = "NO_STARTED_USER_SESSION",
    NO_STARTED_SERVICE_POINT_SESSION = "NO_STARTED_SERVICE_POINT_SESSION",
    NO_PROFILE_SET = "NO_PROFILE_SET",
    INACTIVE = "INACTIVE",
    IN_STORE_NEXT = "IN_STORE_NEXT",
    CALLED = "CALLED",
    SERVING = 'SERVING',
    WRAPUP = "WRAPUP",
    VISIT_NOT_CALLED = "VISIT_NOT_CALLED"
}