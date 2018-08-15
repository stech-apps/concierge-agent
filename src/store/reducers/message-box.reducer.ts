import * as InfoMsgboxActions from '../actions'
import { IMessageBox } from '../../models/IMessageBox';

export interface IMessageInfoState{
    MessageBoxInfo:IMessageBox;

}

export const initailState:IMessageInfoState={
   MessageBoxInfo:null,
  
};


export function reducer(state:IMessageInfoState= initailState, action:InfoMsgboxActions.AllInformationBoxActions)
    :IMessageInfoState{
    switch(action.type){
        case InfoMsgboxActions.UPDATE_MSG_INFO:{
            return{
                ...state,
                MessageBoxInfo:action.payload
            }
        };
        case InfoMsgboxActions.RESET_MSG_INFO:{
            return{
                ...state,
                MessageBoxInfo:null
            }
        };
        default:{
            return state;
        }
    }
}