import { Store } from "../../../../node_modules/@ngrx/store";
import * as InfoMsgAction from '../../actions'
import { IMessageInfoState } from "../../reducers/message-box.reducer";
import { Injectable } from "@angular/core";
import { IAppState } from "../../reducers";
import { IMessageBox } from "../../../models/IMessageBox";


@Injectable()
export class InfoMsgDispatchers{
    constructor(private store:Store<IAppState>){}
    
    updateInfoMsgBoxInfo(infoMsgBox:IMessageBox){
        this.store.dispatch(new InfoMsgAction.UpdateMessageInfo(infoMsgBox));
    }

    resetInfoMsgBoxInfo(){
        this.store.dispatch(new InfoMsgAction.ResetMessageInfo);
    }
}
