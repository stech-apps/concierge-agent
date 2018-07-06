import * as AllPlatformActions from '../actions';

const initialState: IPlatformInfoState = {
    isMobile: null,
    userAgent: null,
    loading: false,
    loaded: false,
    error: null
};

export interface IPlatformInfoState {
    isMobile: boolean;
    userAgent: string;
    loading: boolean;
    loaded: boolean;
    error: Object;
}

export function reducer(state: IPlatformInfoState = initialState, action: AllPlatformActions.PlatformDetected): IPlatformInfoState {
    switch (action.type) {
        case AllPlatformActions.PLATFORM_DETECTED: {
            return {
                ...state,
                isMobile: action.payload.isMobile,
                userAgent: action.payload.userAgent,
                loading: true,
                loaded: false,
                error: null
            };
        }

        default: {
            return state;
        }
    }
}

