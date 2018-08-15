import { Action } from '@ngrx/store';
import { INote } from '../../models/INote';
export const SAVE_NOTE = '[Note] SAVE_NOTE';

export class SaveNote implements Action {
    readonly type = SAVE_NOTE;
    constructor(public payload: INote) {}
}