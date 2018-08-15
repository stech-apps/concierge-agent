import { Action } from "@ngrx/store";
import { IMessageBox } from "../../models/IMessageBox";

export const UPDATE_MSG_INFO ='[MessageBoxInfo]UPDATE_MSG_INFO';
export const RESET_MSG_INFO ='[MessageBoxInfo]RESET_MSG_INFO';

export class UpdateMessageInfo implements Action{
    readonly type = UPDATE_MSG_INFO;
    constructor(public payload:IMessageBox){}
}

export class ResetMessageInfo implements Action{
    readonly type = RESET_MSG_INFO;
}

export type AllInformationBoxActions = UpdateMessageInfo|ResetMessageInfo;