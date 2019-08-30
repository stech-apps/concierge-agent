import * as AutoCloseStateActions from '../actions';

export interface IAutoCloseStatus {
    valueToast: boolean;
    valueModal: boolean;
}

const initialState: IAutoCloseStatus = {
    valueToast: false,
    valueModal: false
};

export function reducer(
    state: IAutoCloseStatus = initialState,
    action: AutoCloseStateActions.AllAutoCloseStateActions): IAutoCloseStatus {
    switch (action.type) {
        case AutoCloseStateActions.FETCH_AC_TOAST_STATE: {
            return {
                ...state,
            };
        }
        case AutoCloseStateActions.SET_AC_TOAST_STATE: {
            return {
                ...state,
                valueToast: action.payload,
            };
        }
        case AutoCloseStateActions.FETCH_AC_MODAL_STATE: {
            return {
                ...state,
            };
        }
        case AutoCloseStateActions.SET_AC_MODAL_STATE: {
            return {
                ...state,
                valueModal: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}
