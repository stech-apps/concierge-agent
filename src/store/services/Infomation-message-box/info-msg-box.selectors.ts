import { Injectable } from "@angular/core";
import { Store, createFeatureSelector, createSelector } from "@ngrx/store";
import { IAppState } from "../../reducers";
import { IMessageInfoState } from "../../reducers/message-box.reducer";

const getInfoMsgBoxState = createFeatureSelector<IMessageInfoState>('infoMsgBox')

const getInfoMsgBoxInfo = createSelector( 
    getInfoMsgBoxState,
    (state: IMessageInfoState) => state.MessageBoxInfo
);


@Injectable()
export class InfoMsgBoxSelector{
    constructor(private store: Store<IAppState>){}
    //selectors$
    InfoMsgBoxInfo$ = this.store.select(getInfoMsgBoxInfo);
}