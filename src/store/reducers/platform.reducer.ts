/* export interface IPlatformState {
    isMobile: boolean;
    userAgent: string;
    loading: boolean;
    loaded: boolean;
    error: Object;
}


const initialState: IPlatformState = {
    isMobile: null,
    userAgent: null,
    loading: false,
    loaded: false,
    error: null
};



export function reducer(state: IPlatformState = initialState, action: LicenseActions.AllLicenseActions): ILicenseState {
    switch (action.type) {
        case LicenseActions.FETCH_LICENSE_INFO: {
            return {
                ...state,
                loading: true,
                loaded: false,
                error: null
            };
        }
        case LicenseActions.FETCH_LICENSE_INFO_SUCCESS: {
            return {
                ...state,
                status: action.payload,
                loading: false,
                loaded: true,
                error: null
            };
        }
        case LicenseActions.FETCH_LICENSE_INFO_FAIL: {
            return {
                ...state,
                loading: false,
                loaded: true,
                error: {
                    ...action.payload
                }
            };
        }
        default: {
            return state;
        }
    }
}

*/