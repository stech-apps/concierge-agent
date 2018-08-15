import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IAppState } from '../../reducers';

import * as Actions from '../../actions';
import { INote } from '../../../models/INote';

@Injectable()
export class NoteDispatchers {
  constructor(private store: Store<IAppState>) {}

  saveNote(note:INote) {
    this.store.dispatch(new Actions.SaveNote(note));
  }

  
}
