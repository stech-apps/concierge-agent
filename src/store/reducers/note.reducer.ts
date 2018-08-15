import * as AllNotections from '../actions';
import { INote } from '../../models/INote';
const initialState: INoteState = {
text:''
};
export interface INoteState {
    text: string;
}

export function reducer(state: INoteState = initialState, action: AllNotections.SaveNote): INoteState {
    switch (action.type) {
        case AllNotections.SAVE_NOTE: {
            return {
                ...state,
                text: action.payload.text,
              
            };
        }

        default: {
            return state;
        }
    }
}