import * as ToastStateActions from '../actions';

export interface IToastStatus {
    value: boolean;
}

const initialState: IToastStatus = {
value:false
};

export function reducer(
    state: IToastStatus = initialState, 
    action: ToastStateActions.AllToastStateActions): IToastStatus {
    switch (action.type) {
        case ToastStateActions.FETCH_TOAST_STATE: {
            return {
                ...state,
            };
        }
        case ToastStateActions.SET_TOAST_STATE: {
            return {
                ...state,
                value: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}